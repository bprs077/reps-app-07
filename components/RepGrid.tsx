import { Box, Text, Stack, Skeleton, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OfficialCard from '../components/OfficialCard'

// Define structure of an official
export interface Official {
  name: string;
  officeName: string;
  levels: string[];
  divisionIdCountry: string;
  divisionIdState: string;
  divisionIdCounty: string;
  divisionIdSmallest: string;
  divisionIdSldu: string;
  divisionIdSldl: string;
  divisionIdCount: number;
  divisionIdName: string;
  party: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emails: string[];
  phones: string[];
  faxNumber: number;
  photo: string;
  rating?: number;  // Optional property for oversight rating
  explanation?: string;  // Optional property for oversight explanation
}

interface OfficialsOversight {
  officeName: string;
  rating: number;
  explanation: string;
}

interface RepGridProps {
  userAddressComplete: string;
  articleTopic: string;
  userPosition: string;
}

export default function RepGrid({ userAddressComplete, articleTopic, userPosition }: RepGridProps) {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [officialsOversight, setOfficialsOversight] = useState<OfficialsOversight[]>([]);
  const [includeOversight, setIncludeOversight] = useState(true); // Fetch oversight ratings and explanations from ChatGPT
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  //console.log(`RepGrid received userAddressComplete: ${userAddressComplete}`);

  //useEffect(() => {
  //  console.log(`userAddressComplete insider RepGrid: ${userAddressComplete}`);
  //}, [userAddressComplete])

  // Function to fetch data for elected officials
  useEffect(() => {
    console.log(`useEffect called: ${userAddressComplete}`);
    const fetchOfficials = async () => {
      setIsLoading(true);
      if ( userAddressComplete !== '') {
        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_ROOT}/api/fetchOfficials`;
          console.log(`apiUrl: ${apiUrl}`);
          const response = await axios.post(apiUrl, { userAddressComplete });
          const fetchedOfficials = Array.isArray(response.data.officials) ? response.data.officials : [];
          //console.log('fetchOfficals: fetchedOfficials...');
          //console.log(fetchedOfficials);
          setOfficials(fetchedOfficials);
  
          // Only proceed to fetch oversight if it's included
          if (includeOversight) {
            await fetchOfficialsOversight(fetchedOfficials);
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error fetching officials:', error);
          setOfficials([]);
          setIsLoading(false);
        }
      }
    };
    
    if (userAddressComplete !== "") {
      console.log(`executing fetchOfficials() for ${userAddressComplete} ...`);
      fetchOfficials();
    }
  }, [userAddressComplete, includeOversight, articleTopic, userPosition]);

  // Watch for changes to officialsOversight and then merge
  useEffect(() => {
    console.log(`test in useEffect`);
    //console.log('useEffect monitoring officialsOversight to call merge function...');
    //console.log(officialsOversight);
    // Ensure merge is called only after officialsOversight is updated and not empty
    if (includeOversight && officialsOversight.length > 0) {
      mergeOfficialsAndOversights();
    }
  }, [officialsOversight]);

  // Fetch officials oversight ratings and explanations
  const fetchOfficialsOversight = async (officialsParam: Official[]) => {
    if (userAddressComplete !== '' && officialsParam.length > 0) {
      try {
        const officeNames = officialsParam.map(official => official.officeName);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_ROOT}/api/generateOfficialsScopeRatings`;
        const response = await axios.post(apiUrl, { articleTopic, userPosition, officeNames });
        const fetchedOversight = Array.isArray(response.data.electedOfficials) ? response.data.electedOfficials : [];
        //console.log(fetchedOversight);
        setOfficialsOversight(fetchedOversight);
      } catch (error) {
        console.error('Error fetching officials oversight:', error);
        setOfficialsOversight([]);
      }
    }
  };

  // Function to merge officials and officialsOversight when officialsOversight updates (if requested by user)
  const mergeOfficialsAndOversights = () => {
    //console.log('mergeOfficialsAndOversights: officialsOversight...');
    //console.log(officialsOversight);
    if (officialsOversight.length > 0) {
      const oversightMap = new Map(officialsOversight.map(oversight => [oversight.officeName, oversight]));
      const updatedOfficials = officials.map(official => {
        const oversight = oversightMap.get(official.officeName);
        return oversight ? { ...official, ...oversight } : official;
      });
      //console.log(updatedOfficials);
      setOfficials(updatedOfficials);
    }
    setIsLoading(false);
  };

  return (
    <>
      {userAddressComplete !== '' ? (
        <Box>
          <Box px="0" textAlign="left">
          {/* Check if isLoading is true before attempting to display officials */}
          {!isLoading ? (
            officials.length > 0 ? (
              <SimpleGrid columns={[1, null, 4]} spacing="10px">
                {officials.map((official, index) => (
                  <OfficialCard key={index} official={official}/>
                ))}
              </SimpleGrid>
            ) : (
              <Text>No officials to display.</Text>
            )
          ) : (
            <Stack>
              <Skeleton height='1em' />
              <Skeleton height='1em' />
              <Skeleton height='1em' />
            </Stack>
          )}
          </Box>
        </Box>
      ) : (
        <Text>Enter your address and click "Fetch My Reps" to see a list of your elected officials.</Text>
      )}
    </>
  );
}