export default {
    'sleep': (ctx, entry, entryData, timeRemains) => {
        const duration = entryData.meta.args[0] || 0
        if (!entryData.elapsed) entryData.elapsed = 0
        
        entryData.elapsed += timeRemains
        
        if (entryData.elapsed >= duration) return { timeRemains: entryData.elapsed - duration, done: true }
        return { timeRemains: 0, done: false }
    }
}