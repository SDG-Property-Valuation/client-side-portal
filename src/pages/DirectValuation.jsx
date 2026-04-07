import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaRupeeSign } from 'react-icons/fa'
import { FiBriefcase, FiCalendar, FiFileText, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'

const clientDefaultValues = {
  fullName: '',
  email: '',
  phone: '',
  propertyAddress: '',
  propertyType: '',
  valuationPurpose: '',
  estimatedValue: '',
  preferredInspectionDate: '',
  notes: '',
}

const bankDefaultValues = {
  institutionName: '',
  branch: '',
  officerName: '',
  officerEmail: '',
  officerPhone: '',
  caseReference: '',
  borrowerName: '',
  propertyAddress: '',
  propertyType: '',
  loanAmount: '',
  reportDeadline: '',
  notes: '',
}

function DirectValuation() {
  const [clientFormData, setClientFormData] = useState(clientDefaultValues)
  const [bankFormData, setBankFormData] = useState(bankDefaultValues)
  const [clientConfirmation, setClientConfirmation] = useState(false)
  const [bankConfirmation, setBankConfirmation] = useState(false)
  const [submitMessage, setSubmitMessage] = useState({
    client: { type: '', text: '' },
    bank: { type: '', text: '' },
  })

  const handleClientChange = (field) => (event) => {
    setClientFormData((previous) => ({ ...previous, [field]: event.target.value }))
  }

  const handleBankChange = (field) => (event) => {
    setBankFormData((previous) => ({ ...previous, [field]: event.target.value }))
  }

  const handleClientSubmit = (event) => {
    event.preventDefault()

    if (!clientConfirmation) {
      setSubmitMessage((previous) => ({
        ...previous,
        client: {
          type: 'error',
          text: 'Please confirm before submitting this request.',
        },
      }))
      return
    }

    setSubmitMessage((previous) => ({
      ...previous,
      client: {
        type: 'success',
        text: 'Request submitted successfully.',
      },
    }))

    setClientFormData(clientDefaultValues)
    setClientConfirmation(false)
  }

  const handleBankSubmit = (event) => {
    event.preventDefault()

    if (!bankConfirmation) {
      setSubmitMessage((previous) => ({
        ...previous,
        bank: {
          type: 'error',
          text: 'Please confirm before submitting this request.',
        },
      }))
      return
    }

    setSubmitMessage((previous) => ({
      ...previous,
      bank: {
        type: 'success',
        text: 'Request submitted successfully.',
      },
    }))

    setBankFormData(bankDefaultValues)
    setBankConfirmation(false)
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="blue" variant="subtle" w="fit-content">
          Direct valuation
        </Badge>
        <Heading>Submit property details</Heading>
        <Text color="gray.700">
          Choose your form and share details with our valuation team.
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Tabs colorScheme="blue" variant="enclosed">
          <TabList>
            <Tab>
              <FiUser style={{ marginRight: '8px' }} />
              Individual form
            </Tab>
            <Tab>
              <FiBriefcase style={{ marginRight: '8px' }} />
              Bank submission
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0} pt={6}>
              <Box as="form" onSubmit={handleClientSubmit}>
                {submitMessage.client.text ? (
                  <Alert
                    status={submitMessage.client.type === 'success' ? 'success' : 'error'}
                    borderRadius="md"
                    mb={6}
                  >
                    <AlertIcon />
                    {submitMessage.client.text}
                  </Alert>
                ) : null}

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Full name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiUser color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Enter full name"
                        value={clientFormData.fullName}
                        onChange={handleClientChange('fullName')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMail color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="name@email.com"
                        value={clientFormData.email}
                        onChange={handleClientChange('email')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Phone</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiPhone color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        value={clientFormData.phone}
                        onChange={handleClientChange('phone')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Property type</FormLabel>
                    <Select
                      placeholder="Choose type"
                      value={clientFormData.propertyType}
                      onChange={handleClientChange('propertyType')}
                      required
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                      <option value="industrial">Industrial</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Property address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMapPin color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Street, city, state"
                        value={clientFormData.propertyAddress}
                        onChange={handleClientChange('propertyAddress')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Reason for valuation</FormLabel>
                    <Select
                      placeholder="Choose reason"
                      value={clientFormData.valuationPurpose}
                      onChange={handleClientChange('valuationPurpose')}
                      required
                    >
                      <option value="sale">Sale or purchase</option>
                      <option value="loan">Loan approval</option>
                      <option value="insurance">Insurance coverage</option>
                      <option value="legal">Legal purpose</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Estimated value (INR)</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaRupeeSign color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter estimated value"
                        value={clientFormData.estimatedValue}
                        onChange={handleClientChange('estimatedValue')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Preferred inspection date</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiCalendar color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="date"
                        value={clientFormData.preferredInspectionDate}
                        onChange={handleClientChange('preferredInspectionDate')}
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                  <FormControl mt={6}>
                  <FormLabel>Notes for our team</FormLabel>
                  <Textarea
                    placeholder="Add access details, document details, or preferred timeline"
                    value={clientFormData.notes}
                    onChange={handleClientChange('notes')}
                  />
                </FormControl>

                <Stack spacing={4} mt={6}>
                  <Checkbox
                    colorScheme="blue"
                    isChecked={clientConfirmation}
                    onChange={(event) => setClientConfirmation(event.target.checked)}
                  >
                    I confirm I am allowed to submit this request.
                  </Checkbox>
                  <Button colorScheme="blue" size="lg" type="submit">
                    Submit request
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel px={0} pt={6}>
              <Box as="form" onSubmit={handleBankSubmit}>
                {submitMessage.bank.text ? (
                  <Alert
                    status={submitMessage.bank.type === 'success' ? 'success' : 'error'}
                    borderRadius="md"
                    mb={6}
                  >
                    <AlertIcon />
                    {submitMessage.bank.text}
                  </Alert>
                ) : null}

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl isRequired>
                    <FormLabel>Institution name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiBriefcase color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Bank or financial institution"
                        value={bankFormData.institutionName}
                        onChange={handleBankChange('institutionName')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Branch</FormLabel>
                    <Input
                      placeholder="Branch name"
                      value={bankFormData.branch}
                      onChange={handleBankChange('branch')}
                      required
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank officer full name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiUser color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Officer full name"
                        value={bankFormData.officerName}
                        onChange={handleBankChange('officerName')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank officer email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMail color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        placeholder="officer@bank.com"
                        value={bankFormData.officerEmail}
                        onChange={handleBankChange('officerEmail')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Bank officer phone</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiPhone color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        value={bankFormData.officerPhone}
                        onChange={handleBankChange('officerPhone')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Case reference ID</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiFileText color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Loan or case reference"
                        value={bankFormData.caseReference}
                        onChange={handleBankChange('caseReference')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Borrower name</FormLabel>
                    <Input
                      placeholder="Primary borrower"
                      value={bankFormData.borrowerName}
                      onChange={handleBankChange('borrowerName')}
                      required
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Property address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiMapPin color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        placeholder="Street, city, state"
                        value={bankFormData.propertyAddress}
                        onChange={handleBankChange('propertyAddress')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Property type</FormLabel>
                    <Select
                      placeholder="Choose type"
                      value={bankFormData.propertyType}
                      onChange={handleBankChange('propertyType')}
                      required
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                      <option value="industrial">Industrial</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Requested loan amount (INR)</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FaRupeeSign color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="number"
                        min="0"
                        placeholder="Enter requested amount"
                        value={bankFormData.loanAmount}
                        onChange={handleBankChange('loanAmount')}
                        required
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Target report date</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiCalendar color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="date"
                        value={bankFormData.reportDeadline}
                        onChange={handleBankChange('reportDeadline')}
                      />
                    </InputGroup>
                  </FormControl>
                </SimpleGrid>

                  <FormControl mt={6}>
                  <FormLabel>Notes for our team</FormLabel>
                  <Textarea
                    placeholder="Add documents, urgency, or branch instructions"
                    value={bankFormData.notes}
                    onChange={handleBankChange('notes')}
                  />
                </FormControl>

                <Stack spacing={4} mt={6}>
                  <Checkbox
                    colorScheme="orange"
                    isChecked={bankConfirmation}
                    onChange={(event) => setBankConfirmation(event.target.checked)}
                  >
                    I confirm I am allowed to submit this bank request.
                  </Checkbox>
                  <Button colorScheme="orange" size="lg" type="submit">
                    Submit request
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Button as={RouterLink} to="/login" variant="link" colorScheme="blue" mt={6}>
          Already registered? Log in to track your request
        </Button>
      </Box>
    </Stack>
  )
}

export default DirectValuation
