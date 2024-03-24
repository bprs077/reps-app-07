import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'About',
    href: '/about'
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

// Build the navbar
export default function Navbar () {
  // Check whether sub-nav items are open
  const { isOpen, onToggle } = useDisclosure();
  // Check whether page is mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, return empty HTML to avoid hydration issue
  if (!mounted) {
    return null;
  }

  // Set some styles
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')

  // Style the navbar
  const StickyNav = styled(Flex)`
    margin: 0;
    padding: 0;
    position: sticky;
    z-index: 10;
    top: 0;
    /*backdrop-filter: saturate(180%) blur(20px);*/
    transition: height .5s, line-height .5s;
  `

  // If mounted, do everything below
  return (
    <StickyNav width="100%" boxShadow='base' rounded='md' bg="white">
      <Flex
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="1200px"
        minWidth="356px"
        width="100%"
        as="nav"
        px={[2, 6, 6]}
        py={0}
        mt={0}
        mb={0}
        mx="auto"
      >
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', md: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
            {/*
            <Text
              textAlign={['center', 'left']} // CHECK BREAKPOINTS
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}>
              Logo
            </Text>
            */}
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Box>
            <Stack
              //flex={{ base: 1, md: 0 }}
              //justify={'flex-end'}
              direction={'row'}
              spacing={4}
              >
              <NextLink href="/login" passHref={false}>
                <Button
                  variant="ghost"
                  px={4}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={linkColor}
                  _hover={{
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  Sign In
                </Button>
              </NextLink>
              <NextLink href="/register" passHref={false}>
                <Button
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.400'}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'blue.300',
                  }}>
                  Sign Up
                </Button>
              </NextLink>
            </Stack>
          </Box>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
            <MobileNav />
        </Collapse>
      </Flex>
    </StickyNav>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')
  //const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box>
          <NextLink href={navItem.href ?? '#'} passHref={false}>
            <Button 
              variant="ghost"
              px={4}
              fontSize={'sm'}
              fontWeight={600}
              color={linkColor}
              _hover={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: linkHoverColor,
              }}>
              {navItem.label}
            </Button>
          </NextLink>
        </Box>
      ))}
    </Stack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      //as="a"
      //href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900'), cursor: 'pointer' }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  )
}

const MobileNav = () => {
  return (
    <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        //as="a"
        //href={href ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          cursor: 'pointer',
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Box 
                //as="a" 
                //href={child.href}
                key={child.label} 
                py={2} 
              >
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}



//export default Navbar
