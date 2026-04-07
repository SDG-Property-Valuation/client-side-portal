import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'

const reveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

function SplashScreen() {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(135deg, #f7f2e8 0%, #ecf7f6 100%)"
      px={6}
    >
      <VStack
        spacing={4}
        textAlign="center"
        animation={`${reveal} 0.7s ease-out both`}
      >
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          textTransform="uppercase"
          letterSpacing="0.35em"
          color="brand.700"
          fontWeight="600"
        >
          Property Valuation Portal
        </Text>
        <Text
          as="h1"
          fontFamily="heading"
          fontWeight="700"
          letterSpacing="0.08em"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          color="brand.900"
        >
          SDG ValuEdge
        </Text>
        <Box w={{ base: '200px', md: '260px' }} h="1px" bg="brand.300" />
        <Text
          fontSize={{ base: 'sm', md: 'md' }}
          color="gray.700"
          fontWeight="500"
          letterSpacing="0.04em"
        >
          Built for Clients and Banking Partners
        </Text>
        <Text
          fontSize={{ base: 'xs', md: 'sm' }}
          color="gray.600"
          fontWeight="500"
          letterSpacing="0.03em"
        >
          Developed by Kaalrav Codeworks
        </Text>
      </VStack>
    </Flex>
  )
}

export default SplashScreen
