import React, { useState, useEffect, FormEvent, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  RadioGroup,
  Stack,
  Input,
  Wrap,
  Radio,
  Text,
  Spacer,
  Divider,
  Textarea,
  Select,
  Skeleton,
  useToast,
  useBreakpointValue
} from '@chakra-ui/react';
import axios from 'axios';
import convertJSONToRows from './GenerateMessage';
import RepGrid from './RepGrid'; // Assuming RepGrid is a separate component

interface Form2Props {
  articleTopic: string;
  userPosition: string;
  setUserPosition: React.Dispatch<React.SetStateAction<string>>;
  userPositionCustom: string;
  setUserPositionCustom: React.Dispatch<React.SetStateAction<string>>;
  messageTone: string;
  setMessageTone: React.Dispatch<React.SetStateAction<string>>;
  onUpdateButtonVisibilityStep3: (visible: boolean) => void;
}

interface MessageContent {
  subject: string;
  body: string[];
}

interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

const Form2: React.FC<Form2Props> = ({ articleTopic, userPosition, setUserPosition, userPositionCustom, setUserPositionCustom, messageTone, setMessageTone, onUpdateButtonVisibilityStep3 }) => {
  const toast = useToast();
  const [fetchState, setFetchState] = useState<'initial' | 'submitting' | 'success'>('initial') // State for Fetch submit status
  const [fetchError, setFetchError] = useState('');
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(false);
  const [messageLength, setMessageLength] = useState('of no more than 100 words');
  const [messageType, setMessageType] = useState('email');
  const [messageContent, setMessageContent] = useState({ subject: '', body: [''] });
  const isButtonVisible = useBreakpointValue({ base: false, sm: true });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editableSubject, setEditableSubject] = useState<string>('');
  const [editableBody, setEditableBody] = useState<string>('');
  const subjectRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Unused arrays for message options
  {/*
  const messageTypes = [
    { value: 'email', label: 'Email' },
    { value: 'fax', label: 'Fax' },
    { value: 'letter', label: 'Letter', disabled: true },
    { value: 'phone script', label: 'Phone call', disabled: true },
  ];
  */}

  const userTones: { value: string; label: string; disabled?: boolean }[] = [
    { value: 'respectful', label: 'Respectful' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'concerned', label: 'Concerned' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'frustrated', label: 'Frustrated' },
    { value: 'forecful', label: 'Forceful' },
  ];

  // values in "words"
  const messageLengths = [
    { value: 'of no more than 100 words', label: 'Short' },
    { value: 'at least 150 words and must be AT LEAST 2 paragraphs', label: 'Medium' },
    { value: 'at least 200 words and at least 3 paragraphs', label: 'Long' },
    { value: 'at least 300 words and at least 3 paragraphs', label: 'Very Long', disabled: false },
  ];

  // Generate message
  const handleGenerateMessage = async (e: FormEvent) => {
    e.preventDefault();
    setFetchState('submitting');
    setShowMessage(false);
    setShowSkeleton(true);
    setFetchError('');

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        //console.log(`arguments to API: ${messageType} | ${messageLength} | ${articleTopic} | ${messageTone} | ${userPosition}`);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_ROOT}/api/generateMessage`
        const response = await axios.post(apiUrl, { messageType, messageLength, articleTopic, messageTone, userPosition });

        if (response && response.data) {
          setMessageContent(response.data);
          setShowMessage(true);
          setFetchState('success');
          setShowSkeleton(false);
          onUpdateButtonVisibilityStep3(true); // Notify parent to show buttons
          //console.log(response.data);
          return;
        } else {
          throw new Error('Malformed response');
        } 
      } catch (error) {
        console.error('Error generating message:', error);
        retries++;
        if (retries === maxRetries) {
          setFetchState('initial');
          setFetchError('Error generating message. Please try again.');
          setMessageContent({ subject: '', body: [''] });
          setShowMessage(false);
          setShowSkeleton(false);
          onUpdateButtonVisibilityStep3(false); // Notify parent to hide buttons in case of error
        }
      }
    }
  };

  // Render radio button options for message type, length, and tone
  const renderRadioOptions = (
    options: Option[],
    selectedValue: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const isButtonVisible = useBreakpointValue({ base: false, sm: true });
  
    if (isButtonVisible) {
      return (
        <Wrap justify="center" spacing="2">
          {options.map((option, index) => (
            <Button
              key={index}
              size={{ base: 'sm', md: 'md'}}
              onClick={() => setValue(option.value)}
              isDisabled={option.disabled || false} // Ensure disabled is boolean
              bgColor={selectedValue === option.value ? "blue.500" : "gray.200"}
              color={selectedValue === option.value ? "white" : "black"}
              _hover={{ bg: selectedValue === option.value ? "blue.600" : "gray.300" }}
            >
              {option.label}
            </Button>
          ))}
        </Wrap>
      );
    } else {
      return (
        <Select onChange={(e) => setValue(e.target.value)} value={selectedValue}>
          {options.map((option, index) => (
            <option key={index} value={option.value} disabled={option.disabled || false}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }
  };

  // Dynamically change the button text and color based on the fetchState
  let buttonText = 'Fetch'; // Default text
  let buttonColorScheme = 'blue'; // Default color

  switch (fetchState) {
    case 'submitting':
      buttonText = 'Generating...';
      buttonColorScheme = 'blue'; // Keep the original color or change it if desired
      break;
    case 'success':
      buttonText = 'Regenerate Message';
      buttonColorScheme = 'green';
      break;
    default:
      buttonText = 'Generate Message';
      buttonColorScheme = 'blue'; // Revert to original color
  }

  // Track state changes
  useEffect(() => {
    //console.log(`messageTone: ${messageTone}`);
  }, [messageTone])

  // Track state changes
  useEffect(() => {
    //console.log(`messageTone: ${messageLength}`);
  }, [messageLength])

  // Sets the content when entering edit mode
  useEffect(() => {
    // Ensure messageContent is not null and has the required properties before setting the states
    if (messageContent && 'subject' in messageContent && 'body' in messageContent) {
      //console.log(messageContent);
      setEditableSubject(messageContent.subject);
      setEditableBody(messageContent.body.join('\n\n')); // Join body paragraphs with line breaks for the textarea
    } else {
      // Handle the case where messageContent is not in the expected format
      console.log('messageContent is not initialized properly.');
      // Here you can set default values or take other appropriate actions
      setEditableSubject('');
      setEditableBody('');
    }
  }, [messageContent]);

  // Adjusts height for the elements when in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Adjust the height of the textareas to fit their content
      const adjustHeight = (element: HTMLTextAreaElement | null) => {
        if (element) {
          element.style.height = 'inherit'; // Reset height to recalculate
          element.style.height = `${element.scrollHeight}px`;
        }
      };
      adjustHeight(subjectRef.current);
      adjustHeight(bodyRef.current);
    }
  }, [isEditMode, editableSubject, editableBody]);

  // Checks for edit mode
  const handleEditClick = () => setIsEditMode(!isEditMode);

  // Makes the email subject
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditableSubject(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setEditableBody(e.target.value);

  // Update messageContent based on edits
  const handleSaveEdits = () => {
    setMessageContent({
      subject: editableSubject,
      body: editableBody.split('\n\n'), // Split the edited body back into paragraphs
    });
    setIsEditMode(false); // Exit edit mode
  };

  return (
    <Box>
      <Heading
        as={'h2'}
        fontSize={{ base: '3xl', sm: '3xl', md: '3xl', lg: '3xl' , xl: '3xl', '2xl': '3xl'}}
        textAlign={'center'}
        mb={2}>
        Step 3: Generate and review your message
      </Heading>
      <Text fontSize="1.2em" lineHeight="1.4em" color="blue.500">Provide the AI with guidance on tone for a unique custom message.</Text>
      <Box p="6">
        <Box mb="4">
          <FormControl isRequired>
            {renderRadioOptions(userTones, messageTone, setMessageTone)}
          </FormControl>
        </Box>
        <Box>
          <FormControl isRequired>
            {renderRadioOptions(messageLengths, messageLength, setMessageLength)}
          </FormControl>
        </Box>
      </Box>
      <Divider />
      <Stack
        py="6"
        w="full"
        direction={{ base: 'column', md: 'row' }} // Stack vertically on small screens, horizontally on medium and up
        spacing={4} // Adjust the spacing as needed
        align="center"
        justify="space-between"
      >
        <Box flex="1">
          <Text align="left"><Box as="span" fontWeight="600">Your Position:</Box> {userPosition}</Text>
        </Box>
        <Stack
          as="form"
          onSubmit={handleGenerateMessage}
          w={{ base: 'full', md: 'auto' }} // Take full width on small screens, auto width on medium and up
          align="center"
        >
          <FormControl>
            <Button
              colorScheme={buttonColorScheme}
              type={fetchState === 'submitting' ? 'button' : 'submit'}
              w={{ base: 'full', md: 'auto' }} // Button takes full width on small screens
            >
              {buttonText}
            </Button>
          </FormControl>
        </Stack>
      </Stack>
      <Box maxWidth="1024px" width="100%" mx='auto'>
        {fetchError && <Text color="red">{fetchError}</Text>}
        {showSkeleton && (
        <Stack>
          <Skeleton height='1em' />
          <Skeleton height='1em' />
          <Skeleton height='1em' />
        </Stack>
        )}
        {showMessage && messageContent && (
          <Box>
            <Divider />
            <Box pt="6" textAlign="left">
              {isEditMode ? (
                <Box>
                  <Flex justify="space-between">
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={2} flex="1" alignItems="left">
                      <Box as="span" pr="1" fontSize="md" fontWeight="700">Subject: </Box>
                      <Input flex="1" defaultValue="Subject" value={editableSubject} onChange={handleSubjectChange}/>
                    </Stack>
                    <Button 
                      ml="20px" 
                      //color={isEditMode ? "white" : "#222222"}
                      //bg={isEditMode ? "red.500" : "gray.200"}
                      colorScheme="red"
                      //_hover={{ color: "black" }}
                      onClick={isEditMode ? handleSaveEdits : handleEditClick}
                    >{isEditMode ? 'Save Edits' : 'Edit Text'}</Button>
                  </Flex>
                  <Text mt={4} fontSize="sm">Dear Mr/Mrs/Ms/Dr {"[Elected Official]"},</Text>
                  <Textarea fontSize="sm" mt={4} ref={bodyRef} value={editableBody} onChange={handleBodyChange} />
                  <Text mt={4} fontSize="sm">Sincerely,</Text>
                  <Text mt={4} fontSize="sm">{"[Your Name]"}</Text>
                </Box>
              ) : (
                <Box p="4">
                  <Flex justify="space-between">
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={2} flex="1" alignItems="left">
                      <Box as="span" pr="1" fontSize="md" fontWeight="700">Subject: </Box>
                      <Text flex="1" fontSize="md" fontWeight="500">{messageContent.subject}</Text>
                    </Stack>
                    <Button 
                      ml="4" 
                      //color={isEditMode ? "white" : "#222222"}
                      //bg={isEditMode ? "red.500" : "gray.200"}
                      colorScheme="gray"
                      onClick={isEditMode ? handleSaveEdits : handleEditClick}
                    >{isEditMode ? 'Save Edits' : 'Edit Text'}</Button>
                  </Flex>
                  
                  <Text mt={4} fontSize="sm">Dear Mr/Mrs/Ms/Dr {"[Elected Official]"},</Text>
                  
                  {messageContent.body.map((paragraph, index) => (
                    <Text key={index} mt={4} fontSize="sm">{paragraph}</Text>
                  ))}
                  <Text mt={4} fontSize="sm">Sincerely,</Text>
                  <Text mt={4} fontSize="sm">{"[Your Name]"}</Text>
                </Box>
              )}
                  </Box>
                </Box>
              )}
      </Box>
    </Box>
  );
};

export default Form2;