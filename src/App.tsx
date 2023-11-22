import styles from './App.module.scss'
import LyricsDisplay from './components/LyricsDisplay.tsx'

function App() {
	return (
		<main className={styles.root}>
			<div className={styles.lyricsContainer}>
				<LyricsDisplay />
			</div>
		</main>
	)
}

export default App
