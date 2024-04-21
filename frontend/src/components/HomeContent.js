import React from 'react';
import styled from 'styled-components';
import img from '../images/image4.png';
import img2 from '../images/image1.png';

const HomeContainer = styled.div`
    color: #fff;
    background-color: #030c12;
`;

const SectionContainer = styled.div`
    width: 100%;
    display: grid;
    height: 860px;
    padding: 0 24px;
    justify-content: center;
    z-index: 1;
    max-width: 1100px;
    margin-right: auto;
    margin-left: auto;
`;

const InstructionsSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: 'col1 col2';
`;

const AboutSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-columns: minmax(auto, 1fr);
    align-items: center;
    grid-template-areas: 'col1 col2';
`;

const Column1 = styled.div`
    margin-bottom: 15px;
    padding: 0 15px;
    grid-area: col1;
`;

const TextContent = styled.div`
    max-width: 540px;
    padding-top: 0;
    padding-bottom: 60px;
`;

const TopLine = styled.p`
    color: #76e4e0;
    font-size: 16px;
    line-height: 16px;
    font-weight: 700;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin-bottom: 16px;
`;

const Header = styled.h1`
    margin-bottom: 24px;
    font-size: 48px;
    line-height: 1.1;
    font-weight: 600;
    color: #f7f8fa;
`;

const Content = styled.p`
    margin-bottom: 35px;
    font-size: 18px;
    line-height: 24px;
    color: #f7f8fa;
`;

const Column2 = styled.div`
    margin-bottom: 15px;
    padding: 0 15px;
    grid-area: col2;
`;

const ImgContainer = styled.div`
    max-width: 555px;
    display: flex;
    justify-content: flex-start;
`;

const Img = styled.img`
    padding-right: 0;
    border: 0;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    max-height: 500px;
`;

const HomeContent = () => {
    return (
        <div>
            <HomeContainer>
                <SectionContainer>
                    <AboutSection id="about-section">
                        <Column1>
                        <TextContent>
                            <TopLine>Improve Your Game</TopLine>
                            <Header>Visualize Your Performance</Header>
                            <Content>Analyze your soccer matches like never before with PitchPro. Upload your GPX files containing GPS data from your games, and let us transform it into a heatmap. See where you've been on the field, identify patterns, and discover areas for improvement to take your game to the next level.</Content>
                        </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                            <Img src={img} alt = 'all' />
                            </ImgContainer>
                        </Column2>
                    </AboutSection>
                </SectionContainer>
            </HomeContainer>
            <HomeContainer>
                <SectionContainer>
                    <InstructionsSection id="instructions-section">
                        <Column1>
                        <TextContent>
                            <TopLine>Get Started in Minutes</TopLine>
                            <Header>Easy Setup Process</Header>
                            <Content>Using PitchPro is simple. First, upload your GPX files containing your GPS data. Then, outline the field boundaries on a Google Maps image to provide context. Remember to track your break times and halftime durations accurately. Once done, hit import, and watch as your data comes to life in a detailed heatmap.</Content>
                        </TextContent>
                        </Column1>
                        <Column2>
                            <ImgContainer>
                            <Img src={img2} alt = 'all' />
                            </ImgContainer>
                        </Column2>
                    </InstructionsSection>
                </SectionContainer>
            </HomeContainer>
        </div>

    );
}
export default HomeContent;