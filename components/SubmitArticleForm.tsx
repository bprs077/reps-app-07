import { FormEvent, ChangeEvent, useEffect, useState } from 'react'
import {
  Stack,
  FormControl,
  Input,
  Button,
  useColorModeValue,
  Heading,
  Text,
  Textarea,
  Box,
  Skeleton,
  Flex,
  Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react'
//import { Suspense } from 'react';
import axios from 'axios'
import GenerateCorrespondenceForm from './GenerateCorrespondenceForm'

// Define the TypeScript interface for a row
interface Row {
  category: string;
  response: string;
}

// Define function to parse response into table format
function convertJSONToRows(jsonObject: { [key: string]: string }) {
  const rows = Object.keys(jsonObject).map(key => ({
    category: key,
    response: jsonObject[key]
  }));
  return rows;
}

export default function SubmitArticleForm() {
  const [state, setState] = useState<'initial' | 'submitting' | 'success'>('initial') // State for Fetch submit status
  const [showSummary, setShowSummary] = useState(false); // State for controlling summary visibility
  const [showSkeleton, setShowSkeleton] = useState(false); // State for controlling skeleton visibility when API is working
  const [showFetchError, setShowFetchError] = useState(false); // State for controlling Fetch error message visibility
  const [rows, setRows] = useState<Row[]>([]);

  const [articleUrl, setArticleUrl] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [electedOfficial, setElectedOfficial] = useState('');
  const [correspondenceType, setCorrespondenceType] = useState('email'); // Default to email
  const [userStance, setUserStance] = useState('strong agreement'); // Default to strong support
  const [tone, setTone] = useState('friendly'); // Default to friendly
  const [length, setLength] = useState('short'); // Default to short
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [response, setResponse] = useState('');
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userZip, setUserZip] = useState('');
  const [userAvatarUrl, setUserAvatarUrl] = useState('')

  // Track changes to the articleUrl to reset state after a successful fetch
  useEffect(() => {
    if (state === 'success') {
      setState('initial');
    }
  }, [articleUrl]);

  // Example parsing function (add this outside your component)
  const parseTableString = (tableString: string) => {
    // Split the input string by newline characters to get lines
    let lines = tableString.split('\n').slice(2); // Start processing from the third line initially
  
    // Function to parse a line into the desired structure
    const parseLine = (line: any) => {
      return line.split('|').slice(1, -1).map((s: string) => s.trim().replace(/\*/g, '')); // Remove asterisks and trim
    };
  
    // Validate the structure of the lines and adjust if necessary
    const isValidStructure = (lines: any) => {
      for (let line of lines) {
        const parts = parseLine(line);
        if (parts.length !== 2) { // Expecting each line to be split into 2 parts: category and response
          return false;
        }
      }
      return true;
    };
  
    // Check if the initial lines array has a valid structure
    if (!isValidStructure(lines)) {
      // If not, redefine lines starting from the second line
      lines = tableString.split('\n').slice(1);
    }
  
    // Map over the lines and return the structured data
    return lines.map((line: string) => {
      const [category, response] = parseLine(line);
      // Ensure that both category and response exist before returning the structured object
      if (category && response) {
        return { category, response };
      }
      // Return a default/fallback object or handle as needed
      return { category: 'Invalid Data', response: 'Invalid Data' };
    }).filter((obj: { category: string; response: string }) => obj.category !== 'Invalid Data'); // Optionally filter out invalid data
  };

  // Generate summary of submitted URL
  const handleArticleSubmit = async (e: any) => {
    setResponse('');
    e.preventDefault();
    try {
      setShowFetchError(false);
      setArticleSummary('');
      setState('submitting');
      setShowSummary(false);
      setShowSkeleton(true); // Display skeleton to signal script is processing

      const apiUrl = `${process.env.NEXT_PUBLIC_API_ROOT}/api/fetchArticle`;
      const response = await axios.post(apiUrl, { articleUrl });
      const responseData = response.data.summary;
      console.log(responseData);

      const newRows = convertJSONToRows(responseData);
      setRows(newRows);

      setShowFetchError(false);
      setArticleSummary(response.data.content);
      setState('success');
      setShowSkeleton(false); // Successful response so disable skeleton
      setShowSummary(true); // Show the summary textarea on successful fetch

    } catch (error: any) {
      console.error('Error fetching article:', error);
      setArticleSummary('');
      //alert(error.message);
      setState('initial');
      setShowSummary(false); // Response failed so don't show summary or skeleton; show blank as initial state
      setShowSkeleton(false);
      setShowFetchError(true);
    }
  };

  // Dynamically change the button text and color based on the state
  let buttonText = 'Fetch'; // Default text
  let buttonColorScheme = 'blue'; // Default color

  switch (state) {
    case 'submitting':
      buttonText = 'Fetching...';
      buttonColorScheme = 'blue'; // Keep the original color or change it if desired
      break;
    case 'success':
      buttonText = 'Success';
      buttonColorScheme = 'green';
      break;
    default:
      buttonText = 'Fetch';
      buttonColorScheme = 'blue'; // Revert to original color
  }

  // Return HTML to be displayed
  return (
    <Box maxWidth="1024px" width="100%" mx="auto">
      <Box
        w='100%'
        maxWidth='860px'
        minWidth='356px'
        mx='auto'
        bg={useColorModeValue('white', 'whiteAlpha.100')}
        rounded={'lg'}
        py={6}>
        <Heading
          as={'h2'}
          fontSize={{ base: '3xl', sm: '3xl', md: '3xl', lg: '3xl' , xl: '3xl', '2xl': '3xl'}}
          textAlign={'center'}
          mb={5}>
          Step 1: Paste a link to any article
        </Heading>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          w={"100%"}
          as={'form'}
          spacing={'12px'}
          onSubmit={handleArticleSubmit}>
          <FormControl>
            <Input
              variant={'solid'}
              borderWidth={1}
              color={'gray.800'}
              _placeholder={{
                color: 'gray.400',
              }}
              borderColor={useColorModeValue('gray.300', 'gray.700')}
              id={'userArticleInput'}
              type={'text'}
              required
              placeholder={'Paste article URL here'}
              aria-label={'Article Link'}
              value={articleUrl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setArticleUrl(e.target.value)}
            />
          </FormControl>
          <FormControl w={{ base: '100%', md: '40%' }}>
            <Button
              //colorScheme={state === 'success' ? 'green' : 'blue'}
              colorScheme={buttonColorScheme}
              //isLoading={state === 'submitting'}
              w="100%"
              type={state === 'success' ? 'button' : 'submit'}
            >
              {buttonText}
            </Button>
          </FormControl>
        </Stack>
      </Box>
      <Box maxWidth="1024px" width="100%" mx='auto'>    
        {showSummary ? ( // If showSummary is TRUE, show the fetched summary
          <Box pt="6">
            <Box overflow="auto">
              <Table variant="simple">
                <Thead bgColor="blue.500">
                  <Tr>
                    <Th
                      fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}} 
                      color="white" 
                      textTransform="none">
                      Category</Th>
                    <Th
                      fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}} 
                      color="white" 
                      textTransform="none"
                    >
                      Response</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Array.isArray(rows) ? rows.slice(0, -2).map((row, index) => (
                  <Tr key={index}>
                    <Td
                    fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
                    lineHeight="1.4em"
                    fontWeight="600"
                    >
                      {row.category}
                      </Td>
                    <Td
                      fontSize={{ base: 'sm', sm: 'sm', md: 'md', lg: 'md', '2xl': 'md'}}
                      lineHeight="1.4em"
                    >
                      {row.response}
                    </Td>
                  </Tr>
                  )) : <Tr><Td colSpan={2} color="red">Error fetching and summarizing article.</Td></Tr>}
                </Tbody>
              </Table>
            </Box>
          </Box>
        ) : showSkeleton ? ( // If showSummary is FALSE, check whether script is fetching summary from API; if yes, show skeleton
          <Stack>
            <Skeleton height='1em' />
            <Skeleton height='1em' />
            <Skeleton height='1em' />
          </Stack>
        ) : showFetchError && (
          <Box>
            <Text color='red'>Error fetching article summary. Make sure URL is correct and try again.</Text>
          </Box>
        )}
        {showSummary && (
          <Box pt="6">
            <GenerateCorrespondenceForm rows={rows}/>
          </Box>
        )}
      </Box>
    </Box>
  )
}
