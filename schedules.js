/**
 * This is an algorithm, whose function is to validate a set of schedules
 * to determine that the data is consistent.
 * It can be used in forms where users can enter n-ranges of hours for a specific day.
 */

 const serviceHours = {
    onsite: [
      {
        dayId: 1,
        schedules: [
          { opening: '07:00', closing: '09:00' },
          { opening: '10:00', closing: '12:00' },
          { opening: '13:00', closing: '16:00' },
          { opening: '17:00', closing: '20:00' }
        ],
        key: 'Sunday',
        enabled: true
      },
      {
        dayId: 2,
        schedules: [
          { opening: '07:00', closing: '11:00' },
          { opening: '12:00', closing: '14:00' }
        ],
        key: 'Monday',
        enabled: false
      },
      {
        dayId: 3,
        schedules: [
          { opening: '08:00', closing: '12:00' },
          { opening: '11:00', closing: '17:00' }
        ],
        key: 'Tuesday',
        enabled: false
      },
      {
        dayId: 4,
        schedules: [
          { opening: '08:00', closing: '12:30' },
          { opening: '12:45', closing: '12:45' }
        ],
        key: 'Wenesday',
        enabled: false
      },
      {
        dayId: 5,
        schedules: [
          { opening: '09:00', closing: '09:00' },
          { opening: '14:00', closing: '17:00' }
        ],
        key: 'Thursday',
        enabled: false
      },
      {
        dayId: 6,
        schedules: [
          { opening: '08:00', closing: '12:00' },
          { opening: '14:00', closing: '17:00' }
        ],
        key: 'Friday',
        enabled: false
      },
      {
        dayId: 7,
        schedules: [
          { opening: '10:00', closing: '08:00' },
          { opening: '16:00', closing: '13:00' }
        ],
        key: 'Saturday',
        enabled: false
      }
    ]
  }
  
  function checkTimeFlow (arr) {
    let flowIsPositive = false
    let diff = 0
    const memo = []
    if (Array.isArray(arr)) {
      for (let index = 0; index < arr.length;) {
        diff = arr[index + 1] - arr[index]
        memo.push(diff)
        if (diff > 0) {
          flowIsPositive = true
          index += 2
        } else if (diff === 0) {
          flowIsPositive = false
          break
        } else break
      }
    }
    return { flowIsPositive, memo }
  }
  
  function checkOverLap (intervals, sample) {
    const min = Math.min(...sample)
    const max = Math.max(...sample)
    const sumIntervals = intervals.reduce((accumulator, curr) => accumulator + curr)
    if (sample.length / 2 > 2) {
      if ((max - min) - sumIntervals > 0) return true
    } else if ((max - min) - sumIntervals >= 0) return true
    else return false
  }
  
  function validateServiceHours (schedules) {
    const a = []
    const b = []
    let status = true
    let message = ''
    let indexFailure = 0
    // verify that the schedules are an arrangement
    if (Array.isArray(schedules)) {
      schedules.forEach((day, index) => {
        day.schedules.forEach((obj) => {
          a[index] = [...a[index] || [], ...Object.values(obj)]
        })
      })
    }
  
    /**
     * a = [
     *  [ '07:00', '12:00', '14:00', '17:00' ],
        [ '07:00', '11:00', '10:00', '14:00' ],
        [ '08:00', '12:00', '11:00', '17:00' ],
        [ '08:00', '12:30', '12:45', '12:45' ],
        [ '09:00', '09:00', '14:00', '17:00' ],
        [ '08:00', '12:00', '14:00', '17:00' ],
        [ '10:00', '08:00', '16:00', '13:00' ]
      ]
     */
  
    a.forEach((group, index) => {
      const c = group.map(hour => {
        return new Date(`January 01, 2023 ${hour}`).getTime()
      })
      b[index] = c
    })
  
    /**
     * b = [
        [ 1672578000000, 1672596000000, 1672603200000, 1672614000000 ],
        [ 1672578000000, 1672592400000, 1672588800000, 1672603200000 ],
        [ 1672581600000, 1672596000000, 1672592400000, 1672614000000 ],
        [ 1672581600000, 1672597800000, 1672598700000, 1672598700000 ],
        [ 1672585200000, 1672585200000, 1672603200000, 1672614000000 ],
        [ 1672581600000, 1672596000000, 1672603200000, 1672614000000 ],
        [ 1672588800000, 1672581600000, 1672610400000, 1672599600000 ]
      ]
     */
  
    for (let index = 0; index < b.length;) {
      const { flowIsPositive, memo } = checkTimeFlow(b[index])
      if (!flowIsPositive) {
        status = false
        message = `Error: ${a[index]}`
        indexFailure = index
        break
      }
  
      if (!checkOverLap(memo, b[index])) {
        status = false
        message = `Failed schedules: ${a[index]}`
        indexFailure = index
        break
      }
      index++
    }
    return { status, message, indexFailure }
  }
  
  const c = validateServiceHours(serviceHours.onsite)
  console.log(c)
  