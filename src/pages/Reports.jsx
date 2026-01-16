import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload, FiFileText } from 'react-icons/fi'
import { reports } from '../data/reports.js'
import { useI18n } from '../i18n/LanguageProvider.jsx'

const statusColors = {
  Completed: 'teal',
  'In Review': 'orange',
  Draft: 'gray',
}

function Reports() {
  const { t, language } = useI18n()
  const statusLabels = {
    Completed: t('status.completed'),
    'In Review': t('status.inReview'),
    Draft: t('status.draft'),
  }
  const clientTypeLabels = {
    Bank: t('clientType.bank'),
    Personal: t('clientType.personal'),
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {t('reports.badge')}
        </Badge>
        <Heading>{t('reports.heading')}</Heading>
        <Text color="gray.700">
          {t('reports.subheading')}
        </Text>
      </Stack>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {reports.map((report) => (
          <Box
            key={report.id}
            bg="whiteAlpha.900"
            borderRadius="24px"
            p={{ base: 6, md: 7 }}
            boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
          >
            <Stack spacing={4}>
              <HStack justify="space-between" align="flex-start">
                <Badge colorScheme={statusColors[report.status] || 'gray'}>
                  {statusLabels[report.status] || report.status}
                </Badge>
                <HStack spacing={2} color="gray.500" fontSize="sm">
                  <Icon as={FiFileText} />
                  <Text>{report.id}</Text>
                </HStack>
              </HStack>
              <Box>
                <Heading size="md" mb={2}>
                  {language === 'mr' && report.titleMr ? report.titleMr : report.title}
                </Heading>
                <Text color="gray.600">{report.address}</Text>
              </Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('reports.label.requestedBy')}
                  </Text>
                  <Text fontWeight="600">{report.requestedBy}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('reports.label.estimatedValue')}
                  </Text>
                  <HStack spacing={2}>
                    <Icon as={FaRupeeSign} color="gray.500" />
                    <Text fontWeight="600">{report.estimatedValue}</Text>
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('reports.label.lastUpdate')}
                  </Text>
                  <Text fontWeight="600">{report.updatedOn}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    {t('reports.label.reportType')}
                  </Text>
                  <Text fontWeight="600">
                    {clientTypeLabels[report.clientType] || report.clientType}
                  </Text>
                </Box>
              </SimpleGrid>
              <Divider borderColor="blackAlpha.200" />
              <Flex gap={3} wrap="wrap">
                <Button
                  as={RouterLink}
                  to={`/reports/${report.id}`}
                  colorScheme="teal"
                  rightIcon={<FiArrowUpRight />}
                >
                  {t('reports.button.viewReport')}
                </Button>
                <Button variant="outline" leftIcon={<FiDownload />}>
                  {t('reports.button.downloadPdf')}
                </Button>
              </Flex>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

export default Reports
