import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
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
import { FaRupeeSign } from 'react-icons/fa'
import { FiDownload, FiFileText } from 'react-icons/fi'

const invoices = [
  {
    id: 'INV-2401',
    caseId: 'VAL-1024',
    amount: '35,000',
    status: 'Paid',
    issuedOn: '05 Jan 2026',
  },
  {
    id: 'INV-2409',
    caseId: 'VAL-1052',
    amount: '48,000',
    status: 'Pending',
    issuedOn: '17 Jan 2026',
  },
  {
    id: 'INV-2418',
    caseId: 'VAL-1088',
    amount: '27,500',
    status: 'Overdue',
    issuedOn: '26 Jan 2026',
  },
]

const statusColors = {
  Paid: 'teal',
  Pending: 'orange',
  Overdue: 'red',
}

function Invoices() {
  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="orange" variant="subtle" w="fit-content">
          Billing
        </Badge>
        <Heading>Your invoices</Heading>
        <Text color="gray.700">
          Check payment status and download invoices.
        </Text>
      </Stack>

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
                <Th>Invoice</Th>
                <Th>Case reference</Th>
                <Th>Amount (INR)</Th>
                <Th>Issued on</Th>
                <Th>Status</Th>
                <Th textAlign="right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice) => (
                <Tr key={invoice.id} _hover={{ bg: 'blackAlpha.50' }}>
                  <Td>
                    <HStack spacing={2} color="gray.600" fontSize="sm">
                      <Icon as={FiFileText} />
                      <Text fontWeight="600">{invoice.id}</Text>
                    </HStack>
                  </Td>
                  <Td>{invoice.caseId}</Td>
                  <Td>
                    <HStack spacing={2}>
                      <Icon as={FaRupeeSign} color="gray.500" />
                      <Text fontWeight="600">{invoice.amount}</Text>
                    </HStack>
                  </Td>
                  <Td>{invoice.issuedOn}</Td>
                  <Td>
                    <Badge colorScheme={statusColors[invoice.status] || 'gray'}>
                      {invoice.status}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2} justify="flex-end">
                      <Button size="sm" colorScheme="teal" leftIcon={<FiDownload />}>
                        Download invoice
                      </Button>
                      <Button size="sm" variant="outline">
                        Billing help
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )
}

export default Invoices
