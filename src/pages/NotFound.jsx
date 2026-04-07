import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function NotFound() {
  return (
    <Box
      bg="whiteAlpha.900"
      borderRadius="24px"
      p={{ base: 6, md: 10 }}
      boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
    >
      <Stack spacing={3} align="flex-start">
        <Heading size="lg">Page not found</Heading>
        <Text color="gray.600">
          This page is not available. Go back to the home page.
        </Text>
        <Button as={RouterLink} to="/" colorScheme="teal">
          Back to home
        </Button>
      </Stack>
    </Box>
  )
}

export default NotFound
