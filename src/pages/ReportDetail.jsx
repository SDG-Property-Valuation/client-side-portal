import {
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import { FiArrowLeft, FiDownload, FiFileText, FiShield } from 'react-icons/fi'
import { getReportById } from '../data/reports.js'
import { useI18n } from '../i18n/LanguageProvider.jsx'

const statusColors = {
  Completed: 'teal',
  'In Review': 'orange',
  Draft: 'gray',
}

function ReportDetail() {
  const { t, language } = useI18n()
  const { reportId } = useParams()
  const report = getReportById(reportId)
  const statusLabels = {
    Completed: t('status.completed'),
    'In Review': t('status.inReview'),
    Draft: t('status.draft'),
  }
  const riskLabels = {
    Low: t('risk.low'),
    Medium: t('risk.medium'),
    High: t('risk.high'),
  }

  if (!report) {
    return (
      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 10 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Stack spacing={3} align="flex-start">
          <Heading size="lg">{t('reportDetail.notFound.title')}</Heading>
          <Text color="gray.600">
            {t('reportDetail.notFound.body')}
          </Text>
          <Button as={RouterLink} to="/reports" colorScheme="teal">
            {t('reportDetail.notFound.back')}
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <HStack spacing={3} align="center">
          <Badge colorScheme={statusColors[report.status] || 'gray'}>
            {statusLabels[report.status] || report.status}
          </Badge>
          <HStack spacing={2} color="gray.500" fontSize="sm">
            <Icon as={FiFileText} />
            <Text>{report.id}</Text>
          </HStack>
        </HStack>
        <Heading>{language === 'mr' && report.titleMr ? report.titleMr : report.title}</Heading>
        <Text color="gray.700">{report.address}</Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Stack spacing={6}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.requestedBy')}
              </Text>
              <Text fontWeight="600">{report.requestedBy}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.estimatedValue')}
              </Text>
              <HStack spacing={2}>
                <Icon as={FaRupeeSign} color="gray.500" />
                <Text fontWeight="600">{report.estimatedValue}</Text>
              </HStack>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.issuedOn')}
              </Text>
              <Text fontWeight="600">
                {language === 'mr' && report.issuedOnMr ? report.issuedOnMr : report.issuedOn}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.riskLevel')}
              </Text>
              <Text fontWeight="600">
                {riskLabels[report.riskLevel] || report.riskLevel}
              </Text>
            </Box>
          </SimpleGrid>
          <Divider borderColor="blackAlpha.200" />
          <Box>
            <HStack spacing={2} mb={2}>
              <Icon as={FiShield} color="teal.500" />
              <Text fontWeight="600">{t('reportDetail.label.summary')}</Text>
            </HStack>
            <Text color="gray.600">
              {language === 'mr' && report.summaryMr ? report.summaryMr : report.summary}
            </Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.method')}
              </Text>
              <Text fontWeight="600">
                {language === 'mr' && report.methodMr ? report.methodMr : report.method}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                {t('reportDetail.label.primaryContact')}
              </Text>
              <Text fontWeight="600">{report.contacts.join(' / ')}</Text>
            </Box>
          </SimpleGrid>
          <Box>
            <Text fontWeight="600" mb={2}>
              {t('reportDetail.label.highlights')}
            </Text>
            <UnorderedList color="gray.600" spacing={2} pl={4}>
              {(language === 'mr' && report.highlightsMr
                ? report.highlightsMr
                : report.highlights
              ).map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </UnorderedList>
          </Box>
          <Divider borderColor="blackAlpha.200" />
          <HStack spacing={3} flexWrap="wrap">
            <Button
              as={RouterLink}
              to="/reports"
              variant="outline"
              leftIcon={<FiArrowLeft />}
            >
              {t('reportDetail.button.back')}
            </Button>
            <Button colorScheme="teal" leftIcon={<FiDownload />}>
              {t('reportDetail.button.downloadPdf')}
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default ReportDetail
