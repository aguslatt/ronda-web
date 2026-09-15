/* ==========================================================================
   Sonido de la animación conceptual (Web Audio, sintetizado)
   Solo se crea cuando la persona lo activa. Acompaña el guion:
   colchón armónico cálido, yerba que cae, mate que se desliza sobre la
   madera, el golpe suave al apoyarlo y una nota final. La pieza se entiende
   sin sonido: todo lo que dice está también en imagen y texto.
   ========================================================================== */
type Point = [number, number]

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

/** Crujido de yerba: granos breves con densidad que acompaña el vertido. */
function rustle(ctx: BaseAudioContext) {
  const rate = ctx.sampleRate
  const seconds = 3.2
  const buffer = ctx.createBuffer(1, Math.floor(rate * seconds), rate)
  const data = buffer.getChannelData(0)
  const rand = seeded(11)
  const density = (t: number) => Math.min(1, t / 0.12) * (t < 2.6 ? 1 : Math.max(0, 1 - (t - 2.6) / 0.6))
  for (let i = 0; i < data.length; i++) data[i] = (rand() * 2 - 1) * 0.06 * density(i / rate)
  for (let g = 0; g < 2600; g++) {
    const t0 = rand() * 3
    if (rand() > density(t0)) continue
    const length = Math.floor((0.002 + rand() * 0.006) * rate)
    const amplitude = 0.2 + rand() * 0.8
    const from = Math.floor(t0 * rate)
    for (let j = 0; j < length && from + j < data.length; j++) {
      const envelope = (1 - j / length) ** 2
      data[from + j] += (rand() * 2 - 1) * amplitude * envelope * 0.6
    }
  }
  let peak = 0
  for (const sample of data) peak = Math.max(peak, Math.abs(sample))
  if (peak > 0) for (let i = 0; i < data.length; i++) data[i] = (data[i] / peak) * 0.9
  return buffer
}

function noise(ctx: BaseAudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  const rand = seeded(29)
  for (let i = 0; i < data.length; i++) data[i] = rand() * 2 - 1
  return buffer
}

export class FilmSound {
  private ctx: AudioContext | null = null
  private out: GainNode | null = null
  private nodes: AudioScheduledSourceNode[] = []
  private buffers: { rustle: AudioBuffer; noise: AudioBuffer } | null = null

  async enable() {
    if (!this.ctx) {
      const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Context()
      const compressor = this.ctx.createDynamicsCompressor()
      this.out = this.ctx.createGain()
      this.out.gain.value = 0.85
      this.out.connect(compressor)
      compressor.connect(this.ctx.destination)
      this.buffers = { rustle: rustle(this.ctx), noise: noise(this.ctx, 2) }
    }
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }

  /** Programa todo el sonido desde el segundo `from` del guion. */
  start(from: number) {
    const { ctx, out, buffers } = this
    if (!ctx || !out || !buffers) return
    this.stop()
    const now = ctx.currentTime + 0.03
    const at = (t: number) => now + Math.max(0, t - from)
    const envelope = (param: AudioParam, points: Point[]) => {
      // Valor en el punto de partida (interpolación lineal) y rampas a los puntos siguientes
      let value = points[0][1]
      for (let i = 1; i < points.length; i++) {
        const [t0, v0] = points[i - 1]
        const [t1, v1] = points[i]
        if (from >= t0 && from <= t1) value = v0 + (v1 - v0) * ((from - t0) / (t1 - t0))
        if (from > t1) value = v1
      }
      param.setValueAtTime(value, now)
      points.filter(([t]) => t > from).forEach(([t, v]) => param.linearRampToValueAtTime(v, at(t)))
    }
    const keep = <T extends AudioScheduledSourceNode>(node: T) => {
      this.nodes.push(node)
      return node
    }

    // Colchón armónico cálido (La mayor abierto), muy bajo
    const pad = ctx.createGain()
    const padFilter = ctx.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.value = 950
    pad.connect(padFilter)
    padFilter.connect(out)
    envelope(pad.gain, [[0, 0], [1.6, 0.035], [11.2, 0.035], [12.4, 0.055], [13.7, 0.05], [14.5, 0]])
    ;[110, 164.81, 277.18, 329.63].forEach((frequency, index) => {
      const osc = keep(ctx.createOscillator())
      osc.type = index % 2 ? 'sine' : 'triangle'
      osc.frequency.value = frequency
      osc.detune.value = (index - 1.5) * 4
      osc.connect(pad)
      osc.start(now)
      osc.stop(at(14.6))
    })

    // Yerba que cae (0,3 a 3,4 s)
    if (from < 3.4) {
      const source = keep(ctx.createBufferSource())
      source.buffer = buffers.rustle
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.value = 3800
      band.Q.value = 0.6
      const high = ctx.createBiquadFilter()
      high.type = 'highpass'
      high.frequency.value = 700
      const gain = ctx.createGain()
      gain.gain.value = 0.5
      source.connect(band).connect(high).connect(gain).connect(out)
      source.start(at(0.3), Math.max(0, from - 0.3))
    }

    // El mate se desliza sobre la madera (3,9 a 6,4 s)
    if (from < 6.4) {
      const source = keep(ctx.createBufferSource())
      source.buffer = buffers.noise
      source.loop = true
      const low = ctx.createBiquadFilter()
      low.type = 'lowpass'
      low.frequency.value = 650
      const gain = ctx.createGain()
      envelope(gain.gain, [[0, 0], [3.9, 0], [4.3, 0.09], [6, 0.06], [6.4, 0]])
      source.connect(low).connect(gain).connect(out)
      source.start(now)
      source.stop(at(6.5))
    }

    // Se apoya frente a quien mira (10,4 s)
    if (from < 10.4) {
      const when = at(10.4)
      ;[
        [180, 0.42, 0.22],
        [360, 0.1, 0.1],
      ].forEach(([frequency, level, decay]) => {
        const osc = keep(ctx.createOscillator())
        osc.frequency.value = frequency
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, when)
        gain.gain.exponentialRampToValueAtTime(level, when + 0.004)
        gain.gain.exponentialRampToValueAtTime(0.0001, when + decay)
        osc.connect(gain).connect(out)
        osc.start(when)
        osc.stop(when + decay + 0.05)
      })
      const click = keep(ctx.createBufferSource())
      click.buffer = buffers.noise
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.value = 1700
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.25, when)
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05)
      click.connect(band).connect(gain).connect(out)
      click.start(when)
      click.stop(when + 0.08)
    }

    // Nota final con la placa de marca (11,7 s)
    if (from < 11.7) {
      const when = at(11.7)
      ;[554.37, 830.61].forEach((frequency) => {
        const osc = keep(ctx.createOscillator())
        osc.frequency.value = frequency
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.0001, when)
        gain.gain.exponentialRampToValueAtTime(0.03, when + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.0001, when + 2.4)
        osc.connect(gain).connect(out)
        osc.start(when)
        osc.stop(when + 2.5)
      })
    }
  }

  stop() {
    this.nodes.forEach((node) => {
      try {
        node.stop()
      } catch {
        /* ya detenido */
      }
    })
    this.nodes = []
  }

  dispose() {
    this.stop()
    void this.ctx?.close()
    this.ctx = null
  }
}
