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
              <h1 className='displayHeading'>Hi, I'm Gavin, a self-taught full stack developer.</h1>
              <div className='lineBreak'></div>
              <p>I love tackling complex problems and finding creative solutions. Whether it's a small feature or a full-fledged application, I enjoy the challenge of making it work seamlessly.</p>
              <p>As a self-taught developer, I've learned how to work independently, solve complex problems, and continuously improve my skills through hands-on experience and self-study. I believe that technology has the power to make a positive impact on people's lives, and I'm always looking for new and exciting ways to create solutions that make a difference.</p>
              <p>In my free time, you can find me tinkering with new technologies, reading about the latest trends in web development, or working on personal projects that challenge me to learn and grow. Whether it's building a website from scratch or optimizing a complex application, I always strive to deliver high-quality results that exceed expectations.</p>
            </Card>
          </div>
          <div className='homeGrid'>
            <Card className='cardMd cardLink' link="https://www.storystarters.co" >
              <div>
              <h1 className='displayHeading'>Story Starters</h1>
              <p>Description of project</p>
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
              <p>Description of project</p>
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
