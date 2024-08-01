import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';
import countriesData from '../data/countries.json';
import { Country, CountriesData } from '../types';
import Flag from 'react-world-flags';
import Modal from 'react-modal';
import { Button, Container, Typography, Box, Fade } from '@mui/material';
import { countryCodes } from '../data/countriesCodes';
import { green, red } from '@mui/material/colors';

const customStyles: { content: React.CSSProperties; overlay: React.CSSProperties } = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255, 255, 255, 1)', // Solid background for the modal
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Slightly more opaque for better contrast
    zIndex: 999,
  },
};

const GameComponent: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fade, setFade] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    setFade(false);
    setIsButtonDisabled(true);
    if (gameOver) {
      setTimeout(() => {
        setScore(0);
        setGameOver(false);
        setCorrectAnswer('');
        setSelectedOption('');
        const countries: Country[] = (countriesData as CountriesData).features;
        const selected = countries[Math.floor(Math.random() * countries.length)].properties.name;
        setSelectedCountry(selected);
        generateOptions(selected, countries);
        setFade(true);
        setIsButtonDisabled(false);
      }, 2000); // delay here for better user experience
    } else {
      setGameOver(false);
      setCorrectAnswer('');
      setSelectedOption('');
      const countries: Country[] = (countriesData as CountriesData).features;
      const selected = countries[Math.floor(Math.random() * countries.length)].properties.name;
      setSelectedCountry(selected);
      generateOptions(selected, countries);
      setFade(true);
      setIsButtonDisabled(false);
    }
  };

  const generateOptions = (selected: string, countries: Country[]) => {
    const optionsSet = new Set<string>();
    optionsSet.add(selected);

    while (optionsSet.size < 4) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)].properties.name;
      optionsSet.add(randomCountry);
    }

    setOptions(Array.from(optionsSet).sort(() => 0.5 - Math.random()));
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    if (option === selectedCountry) {
      setScore(score + 10);
      setCorrectAnswer(option);
      setTimeout(() => startNewGame(), 1000); // delay to show animation for correct answer
    } else {
      setCorrectAnswer(selectedCountry);
      setGameOver(true);
    }
  };

  const getButtonColor = (option: string) => {
    if (option === selectedOption) {
      return option === correctAnswer ? green[500] : red[500];
    }
    return "primary";
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom align='center'>
        Juego de Adivinanza de Países
      </Typography>
      <Typography variant="h5" gutterBottom align='center'>
        Puntuación: {score}
      </Typography>
      <Fade in={fade} timeout={500}>
        <Box my={3}>
          <Typography variant="h6" align='center' gutterBottom>¿Cuál es este país?</Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            {options.map((option) => (
              <Button
                key={option}
                variant="contained"
                sx={{ backgroundColor: getButtonColor(option), '&:hover': { backgroundColor: getButtonColor(option) } }}
                onClick={() => handleOptionClick(option)}
                startIcon={<Flag code={countryCodes[option]} style={{ width: '30px' }} />}
                disabled={isButtonDisabled}
              >
                {option}
              </Button>
            ))}
          </Box>
        </Box>
      </Fade>
      <MapComponent selectedCountry={selectedCountry} />
      <Modal
        isOpen={gameOver}
        onRequestClose={startNewGame}
        style={customStyles}
        contentLabel="Juego Terminado"
        ariaHideApp={false}
      >
        <Typography variant="h4" gutterBottom>
          ¡Juego Terminado!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Puntuación: {score}
        </Typography>
        {correctAnswer && (
          <Typography variant="h6" gutterBottom>
            La respuesta correcta era: {correctAnswer}
          </Typography>
        )}
        <Button variant="contained" color="secondary" onClick={() => { setFade(false); startNewGame(); }} disabled={isButtonDisabled}>
          Jugar de Nuevo
        </Button>
      </Modal>
    </Container>
  );
};

export default GameComponent;
