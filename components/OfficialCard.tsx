import {
  Tooltip,
  Heading,
  Avatar,
  Box,
  Flex,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react'
import { Official } from './RepGrid';

interface OfficialCardProps {
  official: Official;
}

export default function OfficialCard({ official }: OfficialCardProps) {
  const ratingAlpha = official.rating ? (official.rating / 10).toFixed(2) : '1'; // Ensures a string with 2 decimal places
  const borderColor = `rgba(0, 71, 171, ${ratingAlpha})`;
  const bgColor = `rgba(196, 226, 251, ${ratingAlpha})`;

  return (
    <Flex py={0} justifyContent="center"> {/* Use Flex with justifyContent="center" for horizontal centering */}
      <Box
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'md'}
        borderWidth={"3px"}
        bgColor={bgColor}
        borderColor={borderColor}
        rounded={'lg'}
        px={0}
        py={2}
        textAlign={'center'}>
        <Tooltip label={official.explanation} fontSize="sm" borderRadius="md" px="2" pt="1" pb="2">
          <Text fontSize="3xl" pb="2" fontWeight="700" cursor="help">{official.rating}</Text>
        </Tooltip>
        <Heading fontSize={'md'} fontFamily={'body'}>
          {official.name}
        </Heading>
        <Text
          textAlign={'center'}
          color={'blue.400'}
          px={2}
          py={1}
          fontSize={"sm"}
          lineHeight={"1.1em"}
          >
          {official.officeName}
        </Text>
        <Stack align={'start'} justify={'center'} direction={'row'} mt={2}> {/* Use align="start" to align items to the top */}
          {official.emails && official.emails.length > 0 && (
            <Badge
              px={2}
              py={1}
              color={'white'}
              bg={'red.500'} // Use theme color for better theming support
              fontSize="xs"
              fontWeight={'700'}
              borderRadius={'full'}
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.2)'
            >Email</Badge>
          )}
          {official.faxNumber && (
            <Badge
              px={2}
              py={1}
              color={'white'}
              bg={'green.500'} // Use theme color for better theming support
              fontSize="xs"
              fontWeight={'700'}
              borderRadius={'full'}
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.2)'
            >Fax</Badge>
          )}
          {official.phones && official.phones.length > 0 && (
            <Badge
              px={2}
              py={1}
              color={'white'}
              bg={'blue.500'} // Use theme color for better theming support
              fontSize="xs"
              fontWeight={'700'}
              borderRadius={'full'}
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.2)'
            >Phone</Badge>
          )}
        </Stack>
      </Box>
    </Flex>
  )
}