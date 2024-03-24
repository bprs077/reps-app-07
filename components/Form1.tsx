// Form1.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  Tbody,
  Text,
  Textarea,
  Tr,
  Td,
  VStack,
  Spacer
} from '@chakra-ui/react';

interface Row {
  category: string;
  response: string;
}

interface Form1Props {
  rows: Row[];
  selectedRadio: string;
  setSelectedRadio: React.Dispatch<React.SetStateAction<string>>;
  userPosition: string;
  setUserPosition: React.Dispatch<React.SetStateAction<string>>;
  userPositionCustom: string;
  setUserPositionCustom: React.Dispatch<React.SetStateAction<string>>;
  messageTone: string;
  setMessageTone: React.Dispatch<React.SetStateAction<string>>;
  onUpdateButtonVisibilityStep2: (visible: boolean) => void;
}

const Form1: React.FC<Form1Props> = ({ rows, selectedRadio, setSelectedRadio, userPosition, setUserPosition, userPositionCustom, setUserPositionCustom, messageTone, setMessageTone, onUpdateButtonVisibilityStep2 }) => {
  const aiPositions = rows.slice(-2);
  const initialRender = useRef(true);

  // Use array destructuring to create the vector
  const userPositions: { [key: string]: any } = {
    row0: aiPositions.length > 0 ? aiPositions[0].response : '',
    row1: aiPositions.length > 1 ? aiPositions[1].response : '',
    row2: userPositionCustom
  };

  // Set selectedRadio equal to row-0 onload and then disable this block to never run again
  useEffect(() => {
    if (initialRender.current) {
      setSelectedRadio(`row0`);
      setUserPosition(userPositions.row0);
      initialRender.current = false;
    }
  }, []);

  // Handling the selection of the respective radio button when the row is clicked
  const handleRowClick = (e: React.MouseEvent, rowIndex: string) => {
    e.preventDefault(); // Prevents the default action (submit, navigate, etc.)
    e.stopPropagation(); // Stops the click from bubbling up to parent elements.

    //console.log(`handleRowClick: rowIndex (clicked): ${rowIndex}`);
    setSelectedRadio(rowIndex);
    const newPosition = userPositions[rowIndex];
    if (newPosition !== undefined || newPosition !== null) {
      setUserPosition(newPosition);
    } else {
      setUserPosition('');
    }
  };

  // When user done typing new position, update userPositionCustom, userPosition, and selectedRadio
  const handleUserPositionCustom = (positionCustom: any) => {
    setUserPositionCustom(positionCustom);
    setUserPosition(positionCustom);
  }

  //useEffect(() => {
  //  console.log(`selectedRadio: ${selectedRadio}`);
  //}, [selectedRadio])

  useEffect(() => {
    //console.log(`userPosition: ${userPosition}`);
  }, [userPosition])

  useEffect(() => {
    //console.log(`messageTone: ${messageTone}`);
  }, [messageTone])

  // If custom position selected, validate that it has 25+ characters before enabling Next button
  useEffect(() => {
    if (selectedRadio !== 'row2') {
      onUpdateButtonVisibilityStep2(true); // Notify parent to make Next button active
    } else if (userPosition.length >= 75) {
      onUpdateButtonVisibilityStep2(true); // Notify parent to make Next button active
    } else {
      onUpdateButtonVisibilityStep2(false); // Notify parent to make Next button inactive
    }
  }, [selectedRadio, userPosition])

  // Create an object for the Step 2 position labels for users to select
  const positionLabels = ['Choose Position 1...', 'Choose Position 2...'];

  return (
    <>
      <Heading
        as={'h2'}
        fontSize={{ base: '3xl', sm: '3xl', md: '3xl', lg: '3xl' , xl: '3xl', '2xl': '3xl'}}
        textAlign={'center'}
        mb={2}>
        Step 2: Let AI help state your position on the topic
      </Heading>
      <Text pb="6" fontSize="1.2em" color="blue.500">Choose one of the AI-generated positions or write your own.</Text>
      <Flex direction="row" align="stretch" h="full">
        <Box overflow="auto">
          <Divider />
          <Table variant="simple">
            <Tbody>
              <RadioGroup value={selectedRadio}>
                {Array.isArray(aiPositions) && aiPositions.map((row: any, index: any) => {
                  const rowIndex = `row${index}`;
                  const rowData = `${rowIndex}|${row.response}`;
                  return (
                    <Tr 
                      key={rowIndex} 
                      bg={selectedRadio === rowIndex ? '#D9E9F9' : 'transparent'} 
                      cursor="pointer" 
                      onClick={(e) => handleRowClick(e, rowIndex)}
                    >
                      <Td textAlign="center" verticalAlign="middle">
                        <VStack>
                          <Radio size="lg" value={rowIndex} />
                        </VStack>
                      </Td>
                      <Td pl="0" pr="6" verticalAlign="top">
                        <Text fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}} lineHeight="1.4em" fontWeight="700" pb="1">
                          {positionLabels[index]}
                        </Text>
                        <Text fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}} lineHeight="1.4em">
                          {row.response}
                        </Text>
                      </Td>
                    </Tr>
                  );
                })}
                <Tr 
                  bg={selectedRadio === `row2` ? 'blue.100' : 'transparent'} 
                  cursor="pointer" 
                  onClick={(e) => handleRowClick(e, `row2`)}
                >
                  <Td textAlign="center" verticalAlign="middle" px="6">
                    <VStack>
                      <Radio id="textarea" size="lg" value={`row2`} />
                    </VStack>
                  </Td>
                  <Td pt="2" pb="6" pl="0" pr="6" verticalAlign="top">
                    <Text fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
                      lineHeight="1.4em"
                      fontWeight="700"
                      pb="2"
                      pr="4">
                      State your own position...
                    </Text>
                    <Textarea 
                      placeholder="I believe..." 
                      value={userPositionCustom}
                      onChange={(e) => handleUserPositionCustom(e.target.value)}
                    ></Textarea>
                  </Td>
                </Tr>
              </RadioGroup>
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </>
    );
  };
          
  export default Form1;