const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={color}>
      {message}
    </div>
  )
}

export default Notification