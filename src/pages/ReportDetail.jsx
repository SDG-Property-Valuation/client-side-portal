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

const statusColors = {
  Completed: 'teal',
  'In Review': 'orange',
  Draft: 'gray',
}

function ReportDetail() {
  const { reportId } = useParams()
  const report = getReportById(reportId)
  const statusLabels = {
    Completed: 'Done',
    'In Review': 'Under Review',
    Draft: 'Draft',
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
          <Heading size="lg">Report not found</Heading>
          <Text color="gray.600">
            No valuation report found for this reference.
          </Text>
          <Button as={RouterLink} to=".." relative="path" colorScheme="teal">
            Back to reports
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
        <Heading>{report.title}</Heading>
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
                Requested by
              </Text>
              <Text fontWeight="600">{report.requestedBy}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Estimated value (INR)
              </Text>
              <HStack spacing={2}>
                <Icon as={FaRupeeSign} color="gray.500" />
                <Text fontWeight="600">{report.estimatedValue}</Text>
              </HStack>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Issued on
              </Text>
              <Text fontWeight="600">{report.issuedOn}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Risk level
              </Text>
              <Text fontWeight="600">{report.riskLevel}</Text>
            </Box>
          </SimpleGrid>
          <Divider borderColor="blackAlpha.200" />
          <Box>
            <HStack spacing={2} mb={2}>
              <Icon as={FiShield} color="teal.500" />
              <Text fontWeight="600">Summary</Text>
            </HStack>
            <Text color="gray.600">{report.summary}</Text>
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Valuation method
              </Text>
              <Text fontWeight="600">{report.method}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">
                Primary contact
              </Text>
              <Text fontWeight="600">{report.contacts.join(' / ')}</Text>
            </Box>
          </SimpleGrid>
          <Box>
            <Text fontWeight="600" mb={2}>
              Main points
            </Text>
            <UnorderedList color="gray.600" spacing={2} pl={4}>
              {report.highlights.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </UnorderedList>
          </Box>
          <Divider borderColor="blackAlpha.200" />
          <HStack spacing={3} flexWrap="wrap">
            <Button
              as={RouterLink}
              to=".."
              relative="path"
              variant="outline"
              leftIcon={<FiArrowLeft />}
            >
              Back to reports
            </Button>
            <Button colorScheme="teal" leftIcon={<FiDownload />}>
              Download PDF
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Stack>
  )
}

export default ReportDetail
