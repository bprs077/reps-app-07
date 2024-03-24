import React, { useState } from 'react';
import { Box, Button, ButtonGroup, Divider, Tooltip } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import ArticleSubmissionForm from './ArticleSubmissionForm';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';

interface Row {
  category: string;
  response: string;
}

interface AddressInfo {
  userStreetAddress: string;
  userCity: string;
  userStateName: string;
  userZipCode: string;
  combinedAddress: string; // Assuming this combines all the above info in some way
}

interface GenerateMessageProps {
  rows: Row[];
}

// Define function to parse response into table format
export function convertJSONToRows(jsonObject: { [key: string]: string }) {
  const rows = Object.keys(jsonObject).map(key => ({
    category: key,
    response: jsonObject[key]
  }));
  return rows;
}

const GenerateMessage: React.FC = () => {
  const toast = useToast();
  const [step, setStep] = useState<number>(1);
  const [fetchState, setFetchState] = useState('initial');
  const [articleUrl, setArticleUrl] = useState<string>('');
  const [articleTopic, setArticleTopic] = useState<string>('');
  const [selectedRadio, setSelectedRadio] = useState<string>('row0');
  const [userPosition, setUserPosition] = useState<string>('');
  const [userPositionCustom, setUserPositionCustom] = useState<string>('');
  const [messageTone, setMessageTone] = useState<string>('respectful');
  const [userAddressComplete, setUserAddressComplete] = useState<string>('');
  const [rows, setRows] = useState<Row[]>([]);
  const [showNextButtonStep1, setShowNextButtonStep1] = useState<boolean>(false); // State to control buttons visibility
  const [showNextButtonStep2, setShowNextButtonStep2] = useState<boolean>(false); // State to control buttons visibility
  const [showNextButtonStep3, setShowNextButtonStep3] = useState<boolean>(false); // State to control buttons visibility
  const [showNextButtonStep4, setShowNextButtonStep4] = useState<boolean>(false); // State to control buttons visibility
  const [showArticleSummary, setShowArticleSummary] = useState<boolean>(false); // State to control whether summary table is visible on ArticleSubmissionForm

  // Move to next step after fetching article
  const handleRowsUpdate = (newRows: Row[]) => {
    setRows(newRows);
    setStep(2);
  };

  // Function to allow user to move through form using Back and Next buttons
  const moveToStep = (newStep: number) => {
    setStep(newStep);
  };

  // Callback function to update button visibility for step 1
  const updateButtonVisibilityStep1 = (visible: boolean) => {
    setShowNextButtonStep1(visible);
  };

  // Callback function to update button visibility for step 2
  const updateButtonVisibilityStep2 = (visible: boolean) => {
    setShowNextButtonStep2(visible);
  };

      // Callback function to update button visibility for step 3
  const updateButtonVisibilityStep3 = (visible: boolean) => {
    setShowNextButtonStep3(visible);
  };

  // Callback function to update button visibility for step 4
  const updateButtonVisibilityStep4 = (visible: boolean) => {
    setShowNextButtonStep4(visible);
  };

  return (
    <Box maxWidth="1024px" width="100%" mx="auto">
      {step === 1 && 
        <ArticleSubmissionForm 
          fetchState={fetchState}
          setFetchState={setFetchState}
          rows={rows} 
          setRows={setRows} 
          articleUrl={articleUrl} 
          setArticleUrl={setArticleUrl} 
          articleTopic={articleTopic}
          setArticleTopic={setArticleTopic}
          showArticleSummary={showArticleSummary}
          setShowArticleSummary={setShowArticleSummary}
          onRowsUpdate={handleRowsUpdate} 
          onUpdateButtonVisibilityStep1={updateButtonVisibilityStep1}
        />}
      {step === 2 && 
        <Form1 
          rows={rows} 
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
          userPosition={userPosition}
          setUserPosition={setUserPosition}
          userPositionCustom={userPositionCustom}
          setUserPositionCustom={setUserPositionCustom}
          messageTone={messageTone}
          setMessageTone={setMessageTone}
          onUpdateButtonVisibilityStep2={updateButtonVisibilityStep2}
        />}
      {step === 3 && 
        <Form2 
          articleTopic={articleTopic}
          userPosition={userPosition}
          setUserPosition={setUserPosition}
          userPositionCustom={userPositionCustom}
          setUserPositionCustom={setUserPositionCustom}
          messageTone={messageTone}
          setMessageTone={setMessageTone}
          onUpdateButtonVisibilityStep3={updateButtonVisibilityStep3}
        />}
      {step === 4 && 
        <Form3 
          userPosition={userPosition}
          articleTopic={articleTopic}
          userAddressComplete={userAddressComplete}
          setUserAddressComplete={setUserAddressComplete} 
          onUpdateButtonVisibilityStep4={updateButtonVisibilityStep4}
        />
      }

      {/* Conditionally rendered button groups for each step */}
      {/* Step 1: Paste URL and review summary */}
      {step === 1 && showNextButtonStep1 && (
        <Box>
          <ButtonGroup mt="6">
            <Button onClick={() => moveToStep(2)} w="175px" bgColor="blue.500" color="white" _hover={{ bg: "blue.700" }}>Create Message →</Button>
          </ButtonGroup>
        </Box>
      )}

      {/* Step 2: Select your position + message tone */}
      {step === 2 && (
        <Box>
          <ButtonGroup mt="6">
            <Button onClick={() => moveToStep(1)} w="150px">Back</Button>
            {!showNextButtonStep2 ? (
              <Tooltip label="Your position must be at least 75 characters long." borderRadius="md" p="2" hasArrow>
                <Button onClick={() => moveToStep(3)} w="150px" isDisabled={true} bgColor="blue.500" color="white" _hover={{ bg: "blue.700" }}>Next</Button>
              </Tooltip>
            ) : (
              <Button onClick={() => moveToStep(3)} w="150px" isDisabled={false} bgColor="blue.500" color="white" _hover={{ bg: "blue.700" }}>Next</Button>
            )}
          </ButtonGroup>
        </Box>
      )}

      {/* Step 3: Build and display the message */}
      {step === 3 && (
        <Box>
          <Divider pt="6"/>
          <ButtonGroup mt="6">
            <Button onClick={() => moveToStep(2)} w="150px">Back</Button>
            <Button onClick={() => moveToStep(4)} w="150px" isDisabled={!showNextButtonStep3} bgColor="blue.500" color="white" _hover={{ bg: "blue.700" }}>Next</Button>
          </ButtonGroup>
        </Box>
      )}

      {/* Step 4: Provide your address + select your representatives */}
      {step === 4 && (
        <Box>
          <ButtonGroup mt="6">
          <Button onClick={() => moveToStep(3)} w="150px">Back</Button>
            <Button onClick={() => moveToStep(4)} w="150px" isDisabled={!showNextButtonStep4} bgColor="blue.500" color="white" _hover={{ bg: "blue.700" }}>Next</Button>
          </ButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default GenerateMessage;