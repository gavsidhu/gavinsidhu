import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Container from '@/components/Container'
import Navbar from '@/components/Navbar'
import Card from '@/components/Card'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>

      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <Container>
          <div className='homeGrid'>
            <Card className='cardLg'>
              <h1 className='displayHeading'>Gavin Sidhu</h1>
              <p>I’ve loved making things for as long as I can remember, and wrote my first program when I was 6 years old, just two weeks after my mom brought home the brand new Macintosh LC 550 that I taught myself to type on.</p>
              <p>The only thing I loved more than computers as a kid was space. When I was 8, I climbed the 40-foot oak tree at the back of our yard while wearing my older sister’s motorcycle helmet, counted down from three, and jumped — hoping the tree was tall enough that with just a bit of momentum I’d be able to get to orbit.</p>
            </Card>
            <Card className='cardMd cardLink'>
              <div>
                I’ve loved making things for as long as I can remember, and wrote my first program when I was 6 years old, just two weeks after my mom brought home the brand new Macintosh LC 550 that I taught myself to type on.
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </>
  )
}
