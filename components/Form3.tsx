import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import RepGrid from './RepGrid';

interface Form3Props {
  userPosition: string;
  articleTopic: string;
  userAddressComplete: string;
  setUserAddressComplete: React.Dispatch<React.SetStateAction<string>>;
  onUpdateButtonVisibilityStep4: (visible: boolean) => void;
}

const Form3: React.FC<Form3Props> = ({ userPosition, articleTopic, userAddressComplete, setUserAddressComplete, onUpdateButtonVisibilityStep4 }) => {
// State variables for individual fields
const [userStreetAddress, setUserStreetAddress] = useState('');
const [userCity, setUserCity] = useState('');
const [userStateName, setUserStateName] = useState('');
const [userZipCode, setUserZipCode] = useState('');
const [userCombinedAddress, setUserCombinedAddress] = useState('');
const [isAllFieldsValid, setIsAllFieldsValid] = useState(false);

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
  setUserAddressComplete('');
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
  setUserAddressComplete(userCombinedAddress);
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
        <Flex direction={{ base: "column", md: "row" }} gap={4} flex="5">
          {/* Left Two-thirds: Address Inputs */}
          <Flex direction={{ base: "column", md: "row" }} flex={4} gap={4}>
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
          <RepGrid userAddressComplete={userAddressComplete} articleTopic={articleTopic} userPosition={userPosition}/>
        </Box>
      </Flex>
    </Box>
  </>
);
};

export default Form3;