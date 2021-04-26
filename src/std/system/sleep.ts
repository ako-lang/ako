export default {
    'sleep': (ctx, entry, entryData, timeRemains) => {
        // console.log('sleep', fn)
        const duration = entryData.meta.args[0] || 0
        entryData.elapsed += timeRemains
        if (entryData.elapsed >= duration) {
            // console.log('Finish Waiting', fn.uid, fn.elapsed - timeRemains)
            return { timeRemains: entryData.elapsed - duration, done: true }
        }
        // console.log('WAITING !', fn.uid, fn.elapsed)
        return { timeRemains: 0, done: false }
    }
}