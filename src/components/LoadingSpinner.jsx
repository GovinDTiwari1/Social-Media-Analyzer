function LoadingSpinner({ progress }) {
  return (
    <div className="loading">
      <p>Processing... {progress}%</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default LoadingSpinner