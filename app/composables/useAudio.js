export const useAudio = () => {
    // Simple synthesizer using Web Audio API
    // No external assets required!

    let audioCtx = null
    let isMuted = false

    const initAudio = () => {
        if (!audioCtx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext
            audioCtx = new AudioContext()
        }
    }

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (isMuted || !audioCtx) return

        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()

        osc.type = type
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime)

        gain.gain.setValueAtTime(vol, audioCtx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration)

        osc.connect(gain)
        gain.connect(audioCtx.destination)

        osc.start()
        osc.stop(audioCtx.currentTime + duration)
    }

    // "Tick" sound for wheel spinning
    const playTick = () => {
        initAudio()
        // Short, high-pitch "wood block" type sound
        playTone(800, 'triangle', 0.05, 0.05)
    }

    // "Win" sound - a simple major chord arpeggio
    const playWin = () => {
        initAudio()
        const now = audioCtx.currentTime

        // C Major chord (C5, E5, G5, C6)
        const notes = [523.25, 659.25, 783.99, 1046.50]

        notes.forEach((freq, i) => {
            setTimeout(() => {
                playTone(freq, 'sine', 0.6, 0.1)
            }, i * 100)
        })
    }

    // "Click" for UI buttons
    const playClick = () => {
        initAudio()
        playTone(400, 'sine', 0.1, 0.05)
    }

    return {
        playTick,
        playWin,
        playClick,
        initAudio // Call this on first user interaction to unlock AudioContext
    }
}
