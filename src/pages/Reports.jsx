import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { FaRupeeSign } from 'react-icons/fa'
import { FiArrowUpRight, FiDownload, FiFileText } from 'react-icons/fi'
import { reports } from '../data/reports.js'

const statusColors = {
  Completed: 'teal',
  'In Review': 'orange',
  Draft: 'gray',
}

function Reports() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const statusLabels = {
    Completed: 'Done',
    'In Review': 'Under Review',
    Draft: 'Draft',
  }
  const normalizedQuery = query.trim().toLowerCase()

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesStatus =
          statusFilter === 'all' || report.status.toLowerCase() === statusFilter
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [
            report.id,
            report.title,
            report.titleMr,
            report.address,
            report.requestedBy,
          ]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))

        return matchesStatus && matchesQuery
      }),
    [normalizedQuery, statusFilter],
  )

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          Valuation reports
        </Badge>
        <Heading>Your valuation reports</Heading>
        <Text color="gray.700">
          Track submitted properties and download final reports.
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
        p={{ base: 4, md: 6 }}
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by reference, property, address, or requester"
            bg="white"
          />
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            bg="white"
          >
            <option value="all">All statuses</option>
            <option value="completed">Done</option>
            <option value="in review">Under Review</option>
            <option value="draft">Draft</option>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setQuery('')
              setStatusFilter('all')
            }}
          >
            Clear search
          </Button>
        </SimpleGrid>
      </Box>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
        overflow="hidden"
      >
        <TableContainer>
          <Table variant="simple" size="md">
            <Thead bg="blackAlpha.50">
              <Tr>
                <Th>Reference</Th>
                <Th>Property</Th>
                <Th>Estimated value (INR)</Th>
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredReports.map((report) => (
                <Tr key={report.id} _hover={{ bg: 'blackAlpha.50' }}>
                  <Td>
                    <HStack spacing={2} color="gray.600" fontSize="sm">
                      <Icon as={FiFileText} />
                      <Text fontWeight="600">{report.id}</Text>
                    </HStack>
                  </Td>
                  <Td minW={{ base: '220px', md: '280px' }}>
                    <Stack spacing={1}>
                      <Text fontWeight="600">{report.title}</Text>
                      <Text color="gray.600" fontSize="sm">
                        {report.address}
                      </Text>
                    </Stack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Icon as={FaRupeeSign} color="gray.500" />
                      <Text fontWeight="600">{report.estimatedValue}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={statusColors[report.status] || 'gray'}>
                      {statusLabels[report.status] || report.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2} justify="flex-end">
                      <Button
                        as={RouterLink}
                        to={report.id}
                        colorScheme="teal"
                        size="sm"
                        rightIcon={<FiArrowUpRight />}
                      >
                        View report
                      </Button>
                      <Button size="sm" variant="outline" leftIcon={<FiDownload />}>
                        Download PDF
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
              {filteredReports.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Text color="gray.600">No reports found for the current search.</Text>
                  </Td>
                </Tr>
              ) : null}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )
}

export default Reports
