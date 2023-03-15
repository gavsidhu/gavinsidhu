import Head from 'next/head'
import { Inter } from 'next/font/google'
import Container from '@/components/Container'
import Navbar from '@/components/Navbar'
import Card from '@/components/Card'
import Link from 'next/link'
import { FaEnvelope, FaGithub, FaTwitter } from 'react-icons/fa'
import { SiExpress, SiFirebase, SiMongodb, SiNextdotjs, SiPostgresql, SiPython, SiTailwindcss, SiTypescript } from "react-icons/si"


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Gavin Sidhu</title>
      </Head>
      <main>
        <Container>
          <section className='heroSection'>
            <div className='heroContentContainer'>
              <h1 className='heroTitle'>Hi, I'm Gavin, a fullstack developer based in California.</h1>
              <p className='heroParagraph'>I believe that technology has the power to make a positive impact on people's lives, and I'm always looking for new and exciting ways to create solutions that make a difference.</p>
              <div className='socialLinks'>
                <Link
                  href="mailto:gavinjeet.sidhu@gmail.com"
                >
                  <FaEnvelope className='socialIcon' />
                </Link>
                <Link
                  href="https://github.com/gavsidhu"
                >
                  <FaGithub className='socialIcon' />
                </Link>
                <Link
                  href="https://twitter.com/gav_sidhu"
                >
                  <FaTwitter className='socialIcon' />
                </Link>
              </div>
            </div>
            <div style={{ padding: "0px 12px 0px 12px" }}>
              <div className='techStackGrid'>
                <div className='techStackItemContainer'>
                  <SiNextdotjs className='teckStackIcon' />
                  <p>Next.js</p>
                </div>
                <div className='techStackItemContainer offset'>
                  <SiTailwindcss className='teckStackIcon' />
                  <p>Tailwind CSS</p>
                </div>
                <div className='techStackItemContainer'>
                  <SiTypescript className='teckStackIcon' />
                  <p>Typescript</p>
                </div>
                <div className='techStackItemContainer offset'>
                  <SiPostgresql className='teckStackIcon' />
                  <p>PostgreSQL</p>
                </div>
              </div>
              <div className='additionalStackContainer'>
                <SiExpress title='Express.js' className='additionalStackIcon' />
                <SiFirebase title='Firebase' className='additionalStackIcon' />
                <SiMongodb title='MongoDB' className='additionalStackIcon' />
                <SiPython title='Python' className='additionalStackIcon' />
              </div>
            </div>
          </section>
          <div className='homeGrid'>
            <Card className='cardLg cardLink' link="https://www.storystarters.co" >
              <div style={{ display: 'grid', gridTemplateColumns: ".75fr 1fr", alignItems: 'center', padding: '36px 24px 36px 24px' }}>
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <h2 className='displayHeading'>Story Starters</h2>
                  <p>AI story writer that helps fiction writers plan and write their stories. </p>
                </div>
                <div className='projectImage'>
                  <img
                    alt='Story Starters'
                    src="/story-starters.png"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            </Card>
            <Card className='cardMd cardLink' link="https://www.optibot.io">
              <div style={{ display: 'grid', gridTemplateColumns: ".75fr 1fr", alignItems: 'center', padding: '36px 24px 36px 24px' }}>
                <div style={{ marginLeft: "auto", marginRight: "auto" }}>
                  <h2 className='displayHeading'>Optibot</h2>
                  <p>VS Code extention that helps developers document and refactor their code.</p>
                </div>
                <div className='projectImage'>
                  <img
                    alt='Optibot'
                    src="/optibot.png"
                    style={{ width: "100%" }}
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
