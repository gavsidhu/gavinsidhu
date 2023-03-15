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
      <title>Gavin Sidhu</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <Container>
          <div className='flexRow'>
          <Card className='cardLg'>
              <h1 className='displayHeading'>Hi, I'm Gavin, a fullstack developer based in California.</h1>
              <div className='lineBreak'></div>
              <p>I enjoy coming up interesting solutions for tough problems.</p>
              <p>Whether it's a tiny feature or a full-blown app, I thrive on the challenge of making it work smoothly.</p>
              <p>I believe that technology has the power to make a positive impact on people's lives, and I'm always looking for new and exciting ways to create solutions that make a difference.</p>
            </Card>
          </div>
          <div className='homeGrid'>
            <Card className='cardMd cardLink' link="https://www.storystarters.co" >
              <div>
              <h1 className='displayHeading'>Story Starters</h1>
              <p>AI story writer</p>
              <div className='lineBreak'></div>
              <div className='projectImage'>
                <img
                alt='Story Starters'
                src="/story-starters.png"
                style={{width: "100%"}}
                />
              </div>
              </div>
            </Card>
            <Card className='cardMd cardLink' link="https://www.optibot.io">
              <div>
              <h1 className='displayHeading'>Optibot</h1>
              <p>VS Code extention that helps optimize code</p>
              <div className='lineBreak'></div>
              <div className='projectImage'>
                <img
                alt='Story Starters'
                src="/optibot.png"
                style={{width: "100%"}}
                />
              </div>
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </>
  )
}
