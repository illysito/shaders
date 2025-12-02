function countdown() {
  const days = document.querySelector('.is--days')
  const hours = document.querySelector('.is--hours')
  const minutes = document.querySelector('.is--mins')
  const seconds = document.querySelector('.is--secs')

  function updateTimer() {
    console.log(days, hours, minutes, seconds)
    requestAnimationFrame(updateTimer)
  }
  updateTimer()
}

export default countdown
