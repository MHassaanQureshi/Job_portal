
import './App.css'
import Hero from './components/Home-Comp/Hero'
import SearchBar from './components/Home-Comp/SearchBar'
import Navbar from './components/Navbar'

function App() {
 

  return (
    <>
      <Navbar />
      <Hero />
      <section className='w-full flex flex-col items-center'>
        <SearchBar/>
      </section>
    </>
  )
}

export default App
