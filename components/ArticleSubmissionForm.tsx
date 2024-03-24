import React, { useState, ChangeEvent, useEffect, FormEvent } from 'react';
import { Box, 
  Button, 
  FormControl, 
  Input,
  Heading,
  Text,
  Skeleton,
  Stack, 
  useColorModeValue, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  useToast } from '@chakra-ui/react';
import axios from 'axios';

interface Row {
  category: string;
  response: string;
}

interface ArticleSubmissionFormProps {
  fetchState: string;
  setFetchState: React.Dispatch<React.SetStateAction<string>>;
  rows: Row[];
  setRows: React.Dispatch<React.SetStateAction<Row[]>>;
  articleUrl: string;
  setArticleUrl: React.Dispatch<React.SetStateAction<string>>;
  articleTopic: string;
  setArticleTopic: React.Dispatch<React.SetStateAction<string>>;
  showArticleSummary: boolean;
  setShowArticleSummary: React.Dispatch<React.SetStateAction<boolean>>;
  onRowsUpdate: (newRows: Row[]) => void;
  onUpdateButtonVisibilityStep1: (visible: boolean) => void;
}

export default function ArticleSubmissionForm({ fetchState, setFetchState, rows, setRows, articleUrl, setArticleUrl, articleTopic, setArticleTopic, showArticleSummary, setShowArticleSummary, onRowsUpdate, onUpdateButtonVisibilityStep1 }: ArticleSubmissionFormProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false); // State for controlling skeleton visibility when API is working
  const [fetchError, setFetchError] = useState('');
  const toast = useToast();

  function convertJSONToRows(jsonObject: { [key: string]: string }): Row[] {
    return Object.keys(jsonObject).map(key => ({
      category: key,
      response: jsonObject[key]
    }));
  }

  // Inside ArticleSubmissionForm component
  const handleArticleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFetchState('submitting');
    setIsFetching(true);
    setFetchError('');
    setShowArticleSummary(false);
    setShowSkeleton(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ROOT}/api/fetchArticle`, { articleUrl });
      const newRows = convertJSONToRows(response.data.summary); // Convert response to rows
      setRows(newRows); // Update rows state
      setFetchState('success');
      //onRowsUpdate(newRows); // Optionally pass rows up to parent component if needed
      setIsFetching(false); // Alert that no longer fetching
      setShowArticleSummary(true); // Show the summary table
      onUpdateButtonVisibilityStep1(true); // Notify parent to show buttons
    } catch (error) {
      console.error('Error fetching article:', error);
      setFetchState('initial');
      setIsFetching(false);
      setFetchError('Error fetching article summary. Please try again.');
      setShowArticleSummary(false);
      setShowSkeleton(false);
      onUpdateButtonVisibilityStep1(false); // Notify parent to hide buttons in case of error
    }
  };

  // Track changes to the articleUrl to reset state after a successful fetch
  useEffect(() => {
    if (fetchState === 'success') {
      setFetchState('initial');
    }
  }, [articleUrl]);

  // Store articleTopic in a state variable
  useEffect(() => {
    if (rows.length > 0) {
      const topicResponse = rows.find(item => item.category.toLowerCase().includes("topic"));
      setArticleTopic(topicResponse ? topicResponse.response : '');
    }
  }, [rows]);

  // Dynamically change the button text and color based on the fetchState
  let buttonText = 'Fetch'; // Default text
  let buttonColorScheme = 'blue'; // Default color

  switch (fetchState) {
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

  return (
    <Box maxWidth="1024px" width="100%" mx="auto">
      <Box
        w='100%'
        maxWidth='1024px'
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
              _placeholder={{color: 'gray.400'}}
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
          <FormControl w={{ base: '100%', md: '25%' }}>
            <Button
              colorScheme={buttonColorScheme}
              w="100%"
              type={fetchState === 'success' ? 'button' : 'submit'}
            >
              {buttonText}
            </Button>
          </FormControl>
        </Stack>
      </Box>
      <Box maxWidth="1024px" width="100%" mx='auto'>
        {fetchError && <Text color="red">{fetchError}</Text>}
        {showArticleSummary ? (
          <Box pt="6">
            <Box overflow="auto">
              <Table variant="simple">
                <Thead bgColor="blue.500">
                < Tr>
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
        ) : showSkeleton && ( // If showArticleSummary is FALSE, check whether script is fetching summary from API; if yes, show skeleton
        <Stack>
          <Skeleton height='1em' />
          <Skeleton height='1em' />
          <Skeleton height='1em' />
        </Stack>
      )}
      </Box>
    </Box>
  );
}