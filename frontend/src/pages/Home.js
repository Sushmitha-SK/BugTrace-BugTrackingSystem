import React from 'react'
import '../styles/Home.css'
import showCaseImage from '../assets/Bugfixing.png'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const navigate = useNavigate()
    return (
        <>
            <div className="showcase">
                <div className="container">
                    <div className="showcase-top">
                        <a className="navbar-brand" onClick={() => navigate('/')}>
                            BugTrace
                        </a>
                        <button type="button" onClick={() => navigate('/login')}>Login</button>
                    </div>
                    <div className="showcase-content">
                        <div className="sc-left">
                            <h1>Let's make bug tracking easy</h1>
                            {/* <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repudiandae quia officiis perspiciatis vitae hic exercitationem aut. Laborum exercitationem est cupiditate explicabo, illo repudiandae laudantium nisi corrupti!</p> */}
                            {/* <p>Streamline Software Quality with Our Efficient Bug Tracking System.</p> */}
                            <p>Track, Resolve, Innovate: Pioneering Bug Tracking for Smoother, Error-Free Development.</p>
                            <div className="sc-btns">
                                <button type="button" onClick={() => navigate('/login')}>
                                    Get Started
                                </button>

                            </div>
                        </div>
                        <div className="sc-right">
                            <img src={showCaseImage} alt="showcase image" />
                        </div>
                    </div>
                </div>

            </div>


        </>
    )
}

export default Home