// Links: https://chakra-ui.com/docs/components/link

import React from 'react'
import { useColorMode, Button, Flex, Box } from '@chakra-ui/react'
import NextLink from 'next/link'
import styled from '@emotion/styled'
//import theme from '../styles/theme'
import DarkModeSwitch from '../components/DarkModeSwitch'

const Container = ({ children }: { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();

  const bgColor = {
    light: 'white',
    dark: 'mode.dark'
  }

  const textColor = {
    light: '#171717',
    dark: 'white'
  }

  const navHoverBg = {
    light: '#4A5568', // gray.600
    dark: '#CBD5E0' // gray.300
  }

  const navHoverTextColor = {
    light: 'white',
    dark: '#171717'
  }

  const StickyNav = styled(Flex)`
    position: sticky;
    z-index: 10;
    top: 0;
    backdrop-filter: saturate(180%) blur(20px);
    transition: height .5s, line-height .5s;
  `
  return(
    <>
      <StickyNav
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        maxWidth="800px"
        minWidth="356px"
        width="100%"
        //bg={bgColor[colorMode]}
        as="nav"
        px={[2, 6, 6]}
        py={2}
        mt={8}
        mb={[0, 0, 8]}
        mx="auto"
      >
        <Box>
          <NextLink href="/" passHref={false}>
            <Button variant="ghost" p={[1, 2, 4]} _hover={{ backgroundColor: navHoverBg[colorMode], color: navHoverTextColor[colorMode]}}>
              Home
            </Button>
          </NextLink>

          <NextLink href="/about" passHref={false}>
            <Button variant="ghost" p={[1, 2, 4]} _hover={{ backgroundColor: navHoverBg[colorMode], color: navHoverTextColor[colorMode]}}>
              About
            </Button>
          </NextLink>
          <NextLink href="/contact" passHref={false}>
            <Button variant="ghost" p={[1, 2, 4]} _hover={{ backgroundColor: navHoverBg[colorMode], color: navHoverTextColor[colorMode]}}>
              Contact
            </Button>
          </NextLink>
        </Box>
        <Box>
          <NextLink href="/profile" passHref={false}>
            <Button variant="ghost" p={[1, 2, 4]} _hover={{ backgroundColor: navHoverBg[colorMode], color: navHoverTextColor[colorMode]}}>
              Profile
            </Button>
          </NextLink>
          <DarkModeSwitch />
        </Box>
      </StickyNav>
      <Flex
        as="main"
        justifyContent="center"
        flexDirection="column"
        //bg={bgColor[colorMode]}
        color={textColor[colorMode]}
        px={[0, 4, 8]}
        mt={[4, 8, 8]}
      >
        {children}
      </Flex>
    </>
  )
}

export default Container
