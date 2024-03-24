import { useState, useEffect, useRef } from 'react'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  Spacer,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  Radio,
  RadioGroup,
  Text,
  Stack,
  Table, Tbody, Tr, Td,
  Divider,
  VStack
} from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import RepGrid from './RepGrid'

const Form1: React.FC<{ rows: any, userPosition: string; setUserPosition: React.Dispatch<React.SetStateAction<string>>, articleTopic: string}> = (props) => {
  // Initialize form field variables to store response values
  const aiPositions = props.rows.slice(-2);
  const [selectedRadio, setSelectedRadio] = useState('');
  const [userPositionCustom, setUserPositionCustom] = useState('');
  const [messageType, setMessageType] = useState('email');
  const [messageLength, setMessageLength] = useState('short');
  const [messageTone, setMessageTone] = useState('respectful');
  const [isUserPositionValid, setIsUserPositionValid] = useState(true);
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
      props.setUserPosition(userPositions.row0);
      initialRender.current = false;
    }
  }, []);

  // Arrays for radio options
  const [messageTypes, setMessageTypes] = useState([
    { value: 'email', label: 'Email' },
    { value: 'fax', label: 'Fax' },
    { value: 'letter', label: 'Letter', disabled: true },
    { value: 'phone script', label: 'Phone call', disabled: true },
  ]);

  const [messageLengths, setMessageLengths] = useState([
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
    { value: 'very long', label: 'Very long', disabled: true },
  ]);

  const [userTones, setUserTones] = useState([
    { value: 'respectful', label: 'Respectful' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'concerned', label: 'Concerned' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'frustrated', label: 'Frustrated' },
    { value: 'angry', label: 'Angry' },
  ]);

  // Render radio button options for message type, length, and tone
  const renderRadioOptions = (options: { value: string, label: string, disabled?: boolean }[]) =>
  options.map((option, index) => (
    <Radio 
      key={index} 
      value={option.value} 
      isDisabled={option.disabled}
      size={{ base: 'md', sm: 'md', md: 'lg', lg: 'lg', '2xl': 'lg'}}
    >
      {option.label}
    </Radio>
  ));

  // Handling the selection of the respective radio button when the row is clicked
  const handleRowClick = (e: React.MouseEvent, rowIndex: string) => {
    e.preventDefault(); // Prevents the default action (submit, navigate, etc.)
    e.stopPropagation(); // Stops the click from bubbling up to parent elements.

    //console.log(`handleRowClick: rowIndex (clicked): ${rowIndex}`);
    setSelectedRadio(rowIndex);
    const newPosition = userPositions[rowIndex];
    if (newPosition !== undefined || newPosition !== null) {
      props.setUserPosition(newPosition);
      //console.log(`handleRowClick: userPosition (clicked): ${newPosition}`);
    } else {
      props.setUserPosition('');
      //console.log(`No position found for ${rowIndex}`);
    }
  };

  // When user done typing new position, update userPositionCustom, userPosition, and selectedRadio
  const handleUserPositionCustom = (positionCustom: any) => {
    setUserPositionCustom(positionCustom);
    props.setUserPosition(positionCustom);
  }

  useEffect(() => {
    console.log(`selectedRadio: ${selectedRadio}`);
  }, [selectedRadio])

  useEffect(() => {
    console.log(`userPosition: ${props.userPosition}`);
  }, [props.userPosition])

  // Validate userPosition is at least 25 characters
  //const validateUserPosition = (position: string) => {
  //  setIsUserPositionValid(position.length >= 25);
  //};

  // Create an object for the Step 2 position labels for users to select
  const positionLabels = ['Position 1', 'Position 2'];
  
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
                      bg={selectedRadio === rowIndex ? 'blue.100' : 'transparent'} 
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
                      State your own position
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
      <Text py="6" fontSize="1.2em" color="blue.500">Provide the AI with guidance about how to turn your position into a unique message.</Text>
      <Flex>
        <Box mr="5%">
          <FormControl isRequired>
            <FormLabel
              htmlFor="message-type"
              fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
            >Message Type</FormLabel>
            <RadioGroup defaultValue={messageType} onChange={setMessageType}>
              <Stack direction="column" align="start" sx={{ '.chakra-radio__label': { textAlign: 'left' } }}>
                {renderRadioOptions(messageTypes)}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>
        <Spacer />
        <Box mr="5%">
          <FormControl isRequired>
            <FormLabel 
              htmlFor="message-length"
              fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
            >Message Length</FormLabel>
            <RadioGroup defaultValue={messageLength} onChange={setMessageLength}>
              <Stack direction="column" align="start" sx={{ '.chakra-radio__label': { textAlign: 'left' } }}>
                {renderRadioOptions(messageLengths)}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>
        <Spacer />
        <Box mr="5%">
          <FormControl isRequired>
            <FormLabel
              htmlFor="user-tone"
              fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
            >Message Tone</FormLabel>
            <RadioGroup defaultValue={messageTone} onChange={setMessageTone}>
              <Stack direction="column" align="start" sx={{ '.chakra-radio__label': { textAlign: 'left' } }}>
                {renderRadioOptions(userTones)}
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>
        <Spacer />
      </Flex>
      {!isUserPositionValid && <Text color="red.500">Your position must be at least 25 characters.</Text>}
    </>
  )
}

// Input user's address and get representatives
const Form2: React.FC<{ userPosition: string, articleTopic: string }> = ( props ) => {
  
  // State variables for individual fields
  const [userStreetAddress, setUserStreetAddress] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userStateName, setUserStateName] = useState('');
  const [userZipCode, setUserZipCode] = useState('');
  const [userCombinedAddress, setUserCombinedAddress] = useState('');
  const [isAllFieldsValid, setIsAllFieldsValid] = useState(false);
  const [fetchRepsAddress, setFetchRepsAddress] = useState('');

  const stateOptions = [
    { name: "Alabama", abbrev: "AL" },
    { name: "Alaska", abbrev: "AK" },
    { name: "Arizona", abbrev: "AZ" },
    { name: "Arkansas", abbrev: "AR" },
    { name: "California", abbrev: "CA" },
    { name: "Colorado", abbrev: "CO" },
    { name: "Connecticut", abbrev: "CT" },
    { name: "Delaware", abbrev: "DE" },
    { name: "Florida", abbrev: "FL" },
    { name: "Georgia", abbrev: "GA" },
    { name: "Hawaii", abbrev: "HI" },
    { name: "Idaho", abbrev: "ID" },
    { name: "Illinois", abbrev: "IL" },
    { name: "Indiana", abbrev: "IN" },
    { name: "Iowa", abbrev: "IA" },
    { name: "Kansas", abbrev: "KS" },
    { name: "Kentucky", abbrev: "KY" },
    { name: "Louisiana", abbrev: "LA" },
    { name: "Maine", abbrev: "ME" },
    { name: "Maryland", abbrev: "MD" },
    { name: "Massachusetts", abbrev: "MA" },
    { name: "Michigan", abbrev: "MI" },
    { name: "Minnesota", abbrev: "MN" },
    { name: "Mississippi", abbrev: "MS" },
    { name: "Missouri", abbrev: "MO" },
    { name: "Montana", abbrev: "MT" },
    { name: "Nebraska", abbrev: "NE" },
    { name: "Nevada", abbrev: "NV" },
    { name: "New Hampshire", abbrev: "NH" },
    { name: "New Jersey", abbrev: "NJ" },
    { name: "New Mexico", abbrev: "NM" },
    { name: "New York", abbrev: "NY" },
    { name: "North Carolina", abbrev: "NC" },
    { name: "North Dakota", abbrev: "ND" },
    { name: "Ohio", abbrev: "OH" },
    { name: "Oklahoma", abbrev: "OK" },
    { name: "Oregon", abbrev: "OR" },
    { name: "Pennsylvania", abbrev: "PA" },
    { name: "Rhode Island", abbrev: "RI" },
    { name: "South Carolina", abbrev: "SC" },
    { name: "South Dakota", abbrev: "SD" },
    { name: "Tennessee", abbrev: "TN" },
    { name: "Texas", abbrev: "TX" },
    { name: "Utah", abbrev: "UT" },
    { name: "Vermont", abbrev: "VT" },
    { name: "Virginia", abbrev: "VA" },
    { name: "Washington", abbrev: "WA" },
    { name: "West Virginia", abbrev: "WV" },
    { name: "Wisconsin", abbrev: "WI" },
    { name: "Wyoming", abbrev: "WY" },
    { name: "Washington D.C.", abbrev: "DC" }
  ];
  
  // Function to handle changes in address field
  const handleUserStreetAddressChange = (value: any) => {
  //const handleUserStreetAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //const value = event.target.value;
    if (value.length <= 50) {
      setUserStreetAddress(value);
    }
  };

  // Function to handle changes in city field
  const handleUserCityChange = (value: any) => {
    setUserCity(value);
    const isValidLength = value.length <= 50;
    const hasNoNumbers = !/\d/.test(value); // Regular expression to check for digits
    if (isValidLength && hasNoNumbers) {
      setUserCity(value);
    }
  };

  // Function to handle changes in state field
  const handleUserStateNameChange = (value: any) => {
    setUserStateName(value);
  };

  // Function to handle changes in zip code field
  const handleUserZipCodeChange = (value: any) => {
    if (/^\d{0,5}$/.test(value)) {
      setUserZipCode(value);
    }
  };

  // Function to update combined address
  useEffect(() => {
    setIsAllFieldsValid(false);
    setUserCombinedAddress(''); // Every time address element changes, set userCombinedAddress to initial state and check again
    setFetchRepsAddress('');
    //console.log(`new address value: ${userStreetAddress} | ${userCity} | ${userStateName} | ${userZipCode}`);
    if (validateAndCheckFields(userStreetAddress, userCity, userStateName, userZipCode)) {
      const combinedAddress = `${userStreetAddress} ${userCity} ${userStateName} ${userZipCode}`;
      setUserCombinedAddress(combinedAddress);
    }
  }, [userStreetAddress, userCity, userStateName, userZipCode, isAllFieldsValid]);
  
  // Adjust validateAndCheckFields to no longer require parameters and to use the latest state directly
  const validateAndCheckFields = (streetAddress: any, city: any, stateName: any, zipCode: any) => {
    const isValidLengthAddress = streetAddress.trim().length >= 3 && streetAddress.trim().length <= 50;
    const isValidLengthCity = city.trim().length >= 3 && city.trim().length <= 50;
    const hasInvalidCharsAddress = /[@$%&*!?/|()]/.test(streetAddress.trim());
    const hasInvalidCharsOrNumbersCity = /[\d@$%&*!?/|()]/.test(city.trim());
    const otherFieldsAreValid = streetAddress && city && stateName && isValidLengthAddress && isValidLengthCity && !hasInvalidCharsAddress && !hasInvalidCharsOrNumbersCity;
    const isValidZip = /^\d{5}$/.test(zipCode.trim());
    const areFieldsComplete = otherFieldsAreValid && isValidZip;
    setIsAllFieldsValid(!!areFieldsComplete);
    return areFieldsComplete;
  };

  // When "Fetch My Reps" button is clicked, update fetchRepsAddress, which will trigger re-render of <RepGrid> component
  const fetchReps = () => {
    setFetchRepsAddress(userCombinedAddress);
  }

  return (
    <>
      <Heading
        as={'h2'}
        fontSize={{ base: '3xl', sm: '3xl', md: '3xl', lg: '3xl', xl: '3xl', '2xl': '3xl'}}
        textAlign={'center'}
        mb={2}>
        Step 3: Find and select the reps you want to message
      </Heading>
      <Text pb="2" fontSize="1.2em" lineHeight="1.4em" color="blue.500">Elected officials only consider messages from constituents, so your address is required.</Text>
      <Text pb="6" fontSize="0.8em" lineHeight="1em" color="gray.400">Your information is not saved and never sold, leased, or shared. It's only used to determine your representatives.</Text>
      <Box>
        {/* Adjusting to column direction for overall layout */}
        <Flex direction="column" gap={6}>
          {/* Top Row */}
          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            {/* Left Two-thirds: Address Inputs */}
            <Flex direction={{ base: "column", md: "row" }} flex={2} gap={4}>
              {/* Address and City stacked on top of State and Zip */}
              <Flex direction="column" gap={2} flex={1}>
                <FormControl isRequired>
                  <FormLabel ml="1" mt="2" mb="1" fontSize="sm">Street Address</FormLabel>
                  <Input
                    type="text"
                    value={userStreetAddress}
                    onChange={(e) => handleUserStreetAddressChange(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel ml="1" mt="2" mb="1" fontSize="sm">City</FormLabel>
                  <Input
                    type="text"
                    value={userCity}
                    onChange={(e) => handleUserCityChange(e.target.value)}
                  />
                </FormControl>
              </Flex>
              <Flex direction="column" gap={2} flex={1}>
                <FormControl isRequired>
                  <FormLabel ml="1" mt="2" mb="1" fontSize="sm">State</FormLabel>
                  <Select
                    placeholder="Select state"
                    value={userStateName}
                    onChange={(e) => handleUserStateNameChange(e.target.value)}
                  >
                    {stateOptions.map((option) => (
                      <option key={option.abbrev} value={option.abbrev}>{option.name}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel ml="1" mt="2" mb="1" fontSize="sm">Zip Code</FormLabel>
                  <Input
                    type="text"
                    value={userZipCode}
                    onChange={(e) => handleUserZipCodeChange(e.target.value)}
                  />
                </FormControl>
              </Flex>
            </Flex>

            {/* Right Third: Button */}
            <Box flex={1} display="flex" alignItems="center" justifyContent="center">
              <Button
                colorScheme="blue"
                isDisabled={!isAllFieldsValid}
                onClick={fetchReps}
              >
                Fetch My Reps
              </Button>
            </Box>
          </Flex>

          {/* Bottom Row: RepGrid Component */}
          <Box>
            <RepGrid address={fetchRepsAddress} topic={props.articleTopic} position={props.userPosition}/>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

const Form3 = () => {
  return (
    <>
      <Heading
          as={'h2'}
          fontSize={{ base: '3xl', sm: '3xl', md: '3xl', lg: '3xl' , xl: '3xl', '2xl': '3xl'}}
          textAlign={'center'}
          mb={5}>
          Step 4: Review, sign, and send your message!
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl as={GridItem} colSpan={[3, 2]}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            Website
          </FormLabel>
          <InputGroup size="sm">
            <InputLeftAddon
              bg="gray.50"
              _dark={{
                bg: 'gray.800',
              }}
              color="gray.500"
              rounded="md">
              http://
            </InputLeftAddon>
            <Input
              type="tel"
              placeholder="www.example.com"
              focusBorderColor="brand.400"
              rounded="md"
            />
          </InputGroup>
        </FormControl>

        <FormControl id="email" mt={1}>
          <FormLabel
            fontSize="sm"
            fontWeight="md"
            color="gray.700"
            _dark={{
              color: 'gray.50',
            }}>
            About
          </FormLabel>
          <Textarea
            placeholder="you@example.com"
            rows={3}
            shadow="sm"
            focusBorderColor="brand.400"
            fontSize={{
              sm: 'sm',
            }}
          />
          <FormHelperText>
            Brief description for your profile. URLs are hyperlinked.
          </FormHelperText>
        </FormControl>
      </SimpleGrid>
    </>
  )
}

export default function GenerateCorrespondenceForm({ rows }: { rows: any }) {
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33.33)
  const [userPosition, setUserPosition] = useState('initial');

  const articleTopicObject = rows.find((row: { category: string }) => row.category.includes('Topic'));
  const articleTopic = articleTopicObject ? articleTopicObject.response : '';

  useEffect(() => {
    console.log(`articleTopic: ${articleTopic}`);
  }, [])
  
  return (
    <>
      <Box
        borderWidth="1px"
        rounded="lg"
        //shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form">
        {/*<Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated></Progress>*/}
        {step === 1 ? 
          <Form1 rows={rows} userPosition={userPosition} setUserPosition={setUserPosition} articleTopic={articleTopic}/> : step === 2 ? 
          <Form2 userPosition={userPosition} articleTopic={articleTopic}/> : 
          <Form3 />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1)
                  setProgress(progress - 33.33)
                }}
                isDisabled={step === 1}
                colorScheme="blue"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={() => {
                  setStep(step + 1)
                  if (step === 3) {
                    setProgress(100)
                  } else {
                    setProgress(progress + 33.33)
                  }
                }}
                colorScheme="blue"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={() => {
                  toast({
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  })
                }}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  )
}