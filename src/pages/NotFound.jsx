import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function NotFound() {
  const { t } = useI18n()

  return (
    <Box
      bg="whiteAlpha.900"
      borderRadius="24px"
      p={{ base: 6, md: 10 }}
      boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
    >
      <Stack spacing={3} align="flex-start">
        <Heading size="lg">{t('notFound.title')}</Heading>
        <Text color="gray.600">
          {t('notFound.body')}
        </Text>
        <Button as={RouterLink} to="/" colorScheme="teal">
          {t('notFound.button')}
        </Button>
      </Stack>
    </Box>
  )
}

export default NotFound
