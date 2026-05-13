import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import apiClient from '../api/apiClient.js'
import { API_ENDPOINTS } from '../api/endpoints.js'
import { useMemo, useState } from 'react'
import { FaRupeeSign } from 'react-icons/fa'
import { FiCalendar, FiFileText, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { resolveAuthRole } from '../auth/authUtils.js'
import { PROPERTY_TYPE_OPTIONS, VALUATION_PURPOSE_OPTIONS } from '../constants/valuationOptions.js'

const clientDefaultValues = {
  ownerName: '',
  ownerPhoneNumber: '',
  ownerEmail: '',
  visitingAddress: '',
  ownerAddress: '',
  visitingPinCode: '',
  visitingCity: '',
  visitingState: 'Maharashtra',
  propertyType: '',
  valuationPurpose: '',
  targetReportDate: '',
  supportingDocumentsNotes: '',
}

const bankDefaultValues = {
  caseReference: '',
  borrowerName: '',
  borrowerEmail: '',
  borrowerPhoneNumber: '',
  visitingAddress: '',
  borrowerAddress: '',
  visitingPinCode: '',
  visitingCity: '',
  visitingState: 'Maharashtra',
  propertyType: '',
  valuationPurpose: '',
  requiredLoanAmount: '',
  targetReportDate: '',
  supportingDocumentsNotes: '',
}

const cityOptions = ['Chhatrapati Sambhaji Nagar', 'Sillod']

const resolveClientId = (user) => user?._id || user?.id || user?.clientId || ''

const getIsoReportDate = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const parsedDate = new Date(`${dateValue}T00:00:00.000Z`)
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString()
}

const supportingDocumentFields = [
  { name: 'regd_SaleDeed', label: 'Registered Sale Deed' },
  { name: 'regd_LeaseDeed', label: 'Registered Lease Deed' },
  { name: 'agreementToSale', label: 'Agreement to Sale' },
  { name: 'deedOfDeclaration', label: 'Deed of Declaration' },
  { name: 'occupancy', label: 'Occupancy Certificate' },
  { name: 'PR_Card', label: 'PR Card' },
  { name: 'Namuna_No43_Namuna_No8', label: 'Namuna No. 43 / Namuna No. 8' },
  { name: 'landBoundariesbyGramsevak', label: 'Land Boundaries by Gramsevak' },
  { name: 'approvedPermissionPlan', label: 'Approved Permission Plan' },
  { name: 'approved_Lay_Out', label: 'Approved Layout Plan' },
  { name: 'non_agricultureOrder', label: 'Non-Agriculture Order' },
  { name: 'Extract_7_12', label: 'Extract 7/12' },
  { name: 'titleSearchReportByAdvocate', label: 'Title Search Report by Advocate' },
  { name: 'totalLandMeasurement', label: 'Total Land Measurement' },
  { name: 'commencementCertificate', label: 'Commencement Certificate' },
  { name: 'transferOrder', label: 'Transfer Order' },
  { name: 'RERA_Certificate', label: 'RERA Certificate' },
  { name: 'electricityBill', label: 'Electricity Bill' },
  { name: 'work_Done_complicationPlan', label: 'Work Done complicationPlan' },
  { name: 'others', label: 'Others' },
]

const createOfflineDocumentSelection = () =>
  Object.fromEntries(supportingDocumentFields.map(({ name }) => [name, false]))

const createDocumentInputResetKeys = () =>
  Object.fromEntries(supportingDocumentFields.map(({ name }) => [name, 0]))

const clientValidationFieldMap = {
  ownerName: 'ownerName',
  ownerPhoneNumber: 'ownerPhoneNumber',
  ownerEmail: 'ownerEmail',
  ownerAddress: 'ownerAddress',
  propertyType: 'propertyType',
  valuationPurpose: 'valuationPurpose',
  targetReportDate: 'targetReportDate',
  supportingDocuments: 'supportingDocuments',
  visitingAddress: 'visitingAddress',
  propertyAddress: 'visitingAddress',
  'visitingAddress.address': 'visitingAddress',
  'visitingAddress.addressLine1': 'visitingAddress',
  'visitingAddress.addressLine2': 'ownerAddress',
  'visitingAddress.pinCode': 'visitingPinCode',
  'visitingAddress.city': 'visitingCity',
  'visitingAddress.state': 'visitingState',
  'propertyAddress.address': 'visitingAddress',
  'propertyAddress.addressLine1': 'visitingAddress',
  'propertyAddress.addressLine2': 'ownerAddress',
  'propertyAddress.pinCode': 'visitingPinCode',
  'propertyAddress.city': 'visitingCity',
  'propertyAddress.state': 'visitingState',
}

const bankValidationFieldMap = {
  caseReference: 'caseReference',
  borrowerName: 'borrowerName',
  borrowerPhoneNumber: 'borrowerPhoneNumber',
  borrowerEmail: 'borrowerEmail',
  borrowerAddress: 'borrowerAddress',
  propertyType: 'propertyType',
  valuationPurpose: 'valuationPurpose',
  requiredLoanAmount: 'requiredLoanAmount',
  targetReportDate: 'targetReportDate',
  targeReportDate: 'targetReportDate',
  supportingDocumentsNotes: 'supportingDocumentsNotes',
  supportingDocuments: 'supportingDocuments',
  visitingAddress: 'visitingAddress',
  propertyAddress: 'visitingAddress',
  'visitingAddress.address': 'visitingAddress',
  'visitingAddress.addressLine1': 'visitingAddress',
  'visitingAddress.addressLine2': 'borrowerAddress',
  'visitingAddress.pinCode': 'visitingPinCode',
  'visitingAddress.city': 'visitingCity',
  'visitingAddress.state': 'visitingState',
  'propertyAddress.address': 'visitingAddress',
  'propertyAddress.addressLine1': 'visitingAddress',
  'propertyAddress.addressLine2': 'borrowerAddress',
  'propertyAddress.pinCode': 'visitingPinCode',
  'propertyAddress.city': 'visitingCity',
  'propertyAddress.state': 'visitingState',
}

const clearFieldError = (setFieldErrors, field) => {
  setFieldErrors((previous) => {
    if (!previous[field]) {
      return previous
    }

    const nextErrors = { ...previous }
    delete nextErrors[field]
    return nextErrors
  })
}

const hasSelectedSupportingDocuments = (filesByField, offlineSelectionsByField) =>
  supportingDocumentFields.some(({ name }) => {
    const selectedFiles = filesByField[name]
    return (Array.isArray(selectedFiles) && selectedFiles.length > 0) || Boolean(offlineSelectionsByField[name])
  })

const appendSupportingDocumentsToPayload = (payload, filesByField, offlineSelectionsByField) => {
  supportingDocumentFields.forEach(({ name }) => {
    const files = filesByField[name]

    if (Array.isArray(files) && files.length) {
      files.forEach((file) => {
        payload.append(name, file)
      })
      return
    }

    if (offlineSelectionsByField[name]) {
      payload.append(name, 'true')
    }
  })
}

const extractValidationErrors = (errorEntries, fieldMap) => {
  if (!Array.isArray(errorEntries)) {
    return {}
  }

  return errorEntries.reduce((accumulator, entry) => {
    if (!entry || typeof entry !== 'object') {
      return accumulator
    }

    const [[fieldName, message]] = Object.entries(entry)

    if (!fieldName || !message) {
      return accumulator
    }

    const mappedField = fieldMap[fieldName]

    if (mappedField && !accumulator[mappedField]) {
      accumulator[mappedField] = message
    }

    return accumulator
  }, {})
}

const SupportingDocumentsSection = ({
  filesByField,
  inputResetKeys,
  offlineSelectionsByField,
  onFilesChange,
  onOfflineChange,
  onSelectAllOffline,
  accentColorScheme,
  errorMessage,
}) => (
  <Stack spacing={4} mt={6}>
    <Stack
      spacing={3}
      direction={{ base: 'column', md: 'row' }}
      align={{ base: 'flex-start', md: 'center' }}
      justify="space-between"
    >
      <Stack spacing={1}>
        <Heading size="sm">Supporting documents</Heading>
        <Text color="gray.600" fontSize="sm">
          Upload at least one document by category, or mark a document for physical submission if
          you will provide it later.
        </Text>
      </Stack>

      <Button size="sm" variant="outline" colorScheme={accentColorScheme} onClick={onSelectAllOffline}>
        Select all physically
      </Button>
    </Stack>

    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
      {supportingDocumentFields.map((field) => {
        const selectedFiles = filesByField[field.name] || []
        const isOfflineSelected = Boolean(offlineSelectionsByField[field.name])

        return (
          <FormControl key={field.name}>
            <FormLabel fontSize="sm">{field.label}</FormLabel>
            <Stack spacing={2.5}>
              <Input
                key={`${field.name}-${inputResetKeys[field.name] ?? 0}`}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={onFilesChange(field.name)}
                py={1}
                isDisabled={isOfflineSelected}
              />
              {selectedFiles.length ? (
                <Text fontSize="xs" color="gray.600">
                  {selectedFiles.length} file selected
                </Text>
              ) : null}
              <Checkbox
                colorScheme={accentColorScheme}
                isChecked={isOfflineSelected}
                onChange={onOfflineChange(field.name)}
              >
                Submit this document physically
              </Checkbox>
              <Text fontSize="xs" color="gray.500">
                Choose either file upload or physical submission for this document type.
              </Text>
            </Stack>
          </FormControl>
        )
      })}
    </SimpleGrid>

    {errorMessage ? (
      <Text color="red.500" fontSize="sm" fontWeight="500">
        {errorMessage}
      </Text>
    ) : null}
  </Stack>
)

function NewEvaluation() {
  const { authRole, user } = useAuth()
  const toast = useToast()
  const [clientFormData, setClientFormData] = useState(clientDefaultValues)
  const [bankFormData, setBankFormData] = useState(bankDefaultValues)
  const [clientFieldErrors, setClientFieldErrors] = useState({})
  const [bankFieldErrors, setBankFieldErrors] = useState({})
  const [clientSupportingDocuments, setClientSupportingDocuments] = useState({})
  const [bankSupportingDocuments, setBankSupportingDocuments] = useState({})
  const [clientOfflineDocuments, setClientOfflineDocuments] = useState(createOfflineDocumentSelection)
  const [bankOfflineDocuments, setBankOfflineDocuments] = useState(createOfflineDocumentSelection)
  const [clientDocumentInputResetKeys, setClientDocumentInputResetKeys] = useState(createDocumentInputResetKeys)
  const [bankDocumentInputResetKeys, setBankDocumentInputResetKeys] = useState(createDocumentInputResetKeys)
  const [isClientSubmitting, setIsClientSubmitting] = useState(false)
  const [isBankSubmitting, setIsBankSubmitting] = useState(false)

  const resolvedRole = useMemo(() => resolveAuthRole(user?.role, authRole), [authRole, user?.role])

  const headingByRole = {
    client: 'Create valuation request',
    banker: 'Create bank valuation request',
  }

  const descriptionByRole = {
    client:
      'Share property details and track your request in reports and invoices.',
    banker:
      'Share borrower and property details for bank valuation processing.',
  }

  const showSubmissionToast = (status, description) => {
    toast({
      title: status === 'success' ? 'Success' : 'Request failed',
      description,
      status,
      position: 'top-right',
      duration: 4000,
      isClosable: true,
    })
  }

  const handleClientChange = (field) => (event) => {
    clearFieldError(setClientFieldErrors, field)
    setClientFormData((previous) => ({ ...previous, [field]: event.target.value }))
  }

  const handleBankChange = (field) => (event) => {
    clearFieldError(setBankFieldErrors, field)
    setBankFormData((previous) => ({ ...previous, [field]: event.target.value }))
  }

  const handleClientSupportingDocumentChange = (field) => (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    clearFieldError(setClientFieldErrors, 'supportingDocuments')

    setClientSupportingDocuments((previous) => ({
      ...previous,
      [field]: selectedFiles,
    }))

    if (selectedFiles.length) {
      setClientOfflineDocuments((previous) => ({
        ...previous,
        [field]: false,
      }))
    }
  }

  const handleBankSupportingDocumentChange = (field) => (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    clearFieldError(setBankFieldErrors, 'supportingDocuments')

    setBankSupportingDocuments((previous) => ({
      ...previous,
      [field]: selectedFiles,
    }))

    if (selectedFiles.length) {
      setBankOfflineDocuments((previous) => ({
        ...previous,
        [field]: false,
      }))
    }
  }

  const handleClientOfflineDocumentChange = (field) => (event) => {
    const isChecked = event.target.checked
    clearFieldError(setClientFieldErrors, 'supportingDocuments')

    setClientOfflineDocuments((previous) => ({
      ...previous,
      [field]: isChecked,
    }))

    if (isChecked) {
      setClientSupportingDocuments((previous) => ({
        ...previous,
        [field]: [],
      }))
      setClientDocumentInputResetKeys((previous) => ({
        ...previous,
        [field]: (previous[field] ?? 0) + 1,
      }))
    }
  }

  const handleBankOfflineDocumentChange = (field) => (event) => {
    const isChecked = event.target.checked
    clearFieldError(setBankFieldErrors, 'supportingDocuments')

    setBankOfflineDocuments((previous) => ({
      ...previous,
      [field]: isChecked,
    }))

    if (isChecked) {
      setBankSupportingDocuments((previous) => ({
        ...previous,
        [field]: [],
      }))
      setBankDocumentInputResetKeys((previous) => ({
        ...previous,
        [field]: (previous[field] ?? 0) + 1,
      }))
    }
  }

  const handleClientSelectAllOfflineDocuments = () => {
    clearFieldError(setClientFieldErrors, 'supportingDocuments')
    setClientOfflineDocuments(
      Object.fromEntries(supportingDocumentFields.map(({ name }) => [name, true])),
    )
    setClientSupportingDocuments({})
    setClientDocumentInputResetKeys((previous) =>
      Object.fromEntries(
        supportingDocumentFields.map(({ name }) => [name, (previous[name] ?? 0) + 1]),
      ),
    )
  }

  const handleBankSelectAllOfflineDocuments = () => {
    clearFieldError(setBankFieldErrors, 'supportingDocuments')
    setBankOfflineDocuments(
      Object.fromEntries(supportingDocumentFields.map(({ name }) => [name, true])),
    )
    setBankSupportingDocuments({})
    setBankDocumentInputResetKeys((previous) =>
      Object.fromEntries(
        supportingDocumentFields.map(({ name }) => [name, (previous[name] ?? 0) + 1]),
      ),
    )
  }

  const handleClientSubmit = async (event) => {
    event.preventDefault()

    const clientId = resolveClientId(user)
    const normalizedPhoneNumber = clientFormData.ownerPhoneNumber.replace(/\D/g, '')
    const normalizedPinCode = clientFormData.visitingPinCode.replace(/\D/g, '')
    const hasSupportingDocuments = hasSelectedSupportingDocuments(
      clientSupportingDocuments,
      clientOfflineDocuments,
    )

    setClientFieldErrors({})

    if (!hasSupportingDocuments) {
      const message =
        'Upload at least one supporting document or mark one for physical submission.'

      setClientFieldErrors({ supportingDocuments: message })
      showSubmissionToast('error', message)
      return
    }

    setIsClientSubmitting(true)

    try {
      const payload = new FormData()

      if (clientId) {
        payload.append('clientId', clientId)
      }

      payload.append('ownerName', clientFormData.ownerName.trim())
      payload.append('ownerPhoneNumber', normalizedPhoneNumber)

      if (clientFormData.ownerEmail.trim()) {
        payload.append('ownerEmail', clientFormData.ownerEmail.trim())
      }

      payload.append('propertyType', clientFormData.propertyType)
      payload.append('valuationPurpose', clientFormData.valuationPurpose)

      const isoTargetDate = getIsoReportDate(clientFormData.targetReportDate)
      if (isoTargetDate) {
        payload.append('targetReportDate', isoTargetDate)
      }

      payload.append('visitingAddress[address]', clientFormData.visitingAddress.trim())
      if (clientFormData.ownerAddress.trim()) {
        payload.append('ownerAddress', clientFormData.ownerAddress.trim())
      }
      if (normalizedPinCode) {
        payload.append('visitingAddress[pinCode]', normalizedPinCode)
      }
      payload.append('visitingAddress[city]', clientFormData.visitingCity.trim())
      if (clientFormData.visitingState.trim()) {
        payload.append('visitingAddress[state]', clientFormData.visitingState.trim())
      }

      appendSupportingDocumentsToPayload(payload, clientSupportingDocuments, clientOfflineDocuments)

      const response = await apiClient.post(API_ENDPOINTS.inspections.request, payload, {
        withCredentials: true,
      })

      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Unable to submit request right now.')
      }

      showSubmissionToast('success', apiResponse.message || 'Client valuation request submitted successfully.')
      setClientFormData(clientDefaultValues)
      setClientFieldErrors({})
      setClientSupportingDocuments({})
      setClientOfflineDocuments(createOfflineDocumentSelection())
      setClientDocumentInputResetKeys((previous) =>
        Object.fromEntries(
          supportingDocumentFields.map(({ name }) => [name, (previous[name] ?? 0) + 1]),
        ),
      )
    } catch (error) {
      const validationErrors = extractValidationErrors(
        error?.response?.data?.errors,
        clientValidationFieldMap,
      )

      if (Object.keys(validationErrors).length) {
        setClientFieldErrors(validationErrors)
      }

      const apiMessage =
        Object.values(validationErrors)[0] ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Unable to submit request right now.'

      showSubmissionToast('error', apiMessage)
    } finally {
      setIsClientSubmitting(false)
    }
  }

  const handleBankSubmit = async (event) => {
    event.preventDefault()

    const normalizedPhoneNumber = bankFormData.borrowerPhoneNumber.replace(/\D/g, '')
    const normalizedPinCode = bankFormData.visitingPinCode.replace(/\D/g, '')
    const hasSupportingDocuments = hasSelectedSupportingDocuments(
      bankSupportingDocuments,
      bankOfflineDocuments,
    )

    setBankFieldErrors({})

    if (!hasSupportingDocuments) {
      const message =
        'Upload at least one supporting document or mark one for physical submission.'

      setBankFieldErrors({ supportingDocuments: message })
      showSubmissionToast('error', message)
      return
    }

    setIsBankSubmitting(true)

    try {
      const payload = new FormData()

      if (bankFormData.caseReference.trim()) {
        payload.append('caseReference', bankFormData.caseReference.trim())
      }

      payload.append('borrowerName', bankFormData.borrowerName.trim())
      payload.append('borrowerPhoneNumber', normalizedPhoneNumber)

      if (bankFormData.borrowerEmail.trim()) {
        payload.append('borrowerEmail', bankFormData.borrowerEmail.trim())
      }

      payload.append('propertyType', bankFormData.propertyType)
      payload.append('valuationPurpose', bankFormData.valuationPurpose)

      const isoTargetDate = getIsoReportDate(bankFormData.targetReportDate)
      if (isoTargetDate) {
        payload.append('targetReportDate', isoTargetDate)
        payload.append('targeReportDate', isoTargetDate)
      }

      payload.append('visitingAddress[address]', bankFormData.visitingAddress.trim())

      if (bankFormData.borrowerAddress.trim()) {
        payload.append('borrowerAddress', bankFormData.borrowerAddress.trim())
      }

      if (normalizedPinCode) {
        payload.append('visitingAddress[pinCode]', normalizedPinCode)
      }

      payload.append('visitingAddress[city]', bankFormData.visitingCity.trim())

      if (bankFormData.visitingState.trim()) {
        payload.append('visitingAddress[state]', bankFormData.visitingState.trim())
      }

      if (bankFormData.requiredLoanAmount !== '') {
        payload.append('requiredLoanAmount', bankFormData.requiredLoanAmount)
      }

      if (bankFormData.supportingDocumentsNotes.trim()) {
        payload.append('supportingDocumentsNotes', bankFormData.supportingDocumentsNotes.trim())
      }

      appendSupportingDocumentsToPayload(payload, bankSupportingDocuments, bankOfflineDocuments)

      const response = await apiClient.post(API_ENDPOINTS.inspections.request, payload, {
        withCredentials: true,
      })

      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || 'Unable to submit request right now.')
      }

      showSubmissionToast('success', apiResponse.message || 'Bank valuation case submitted successfully.')
      setBankFormData(bankDefaultValues)
      setBankFieldErrors({})
      setBankSupportingDocuments({})
      setBankOfflineDocuments(createOfflineDocumentSelection())
      setBankDocumentInputResetKeys((previous) =>
        Object.fromEntries(
          supportingDocumentFields.map(({ name }) => [name, (previous[name] ?? 0) + 1]),
        ),
      )
    } catch (error) {
      const validationErrors = extractValidationErrors(
        error?.response?.data?.errors,
        bankValidationFieldMap,
      )

      if (Object.keys(validationErrors).length) {
        setBankFieldErrors(validationErrors)
      }

      const apiMessage =
        Object.values(validationErrors)[0] ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        'Unable to submit request right now.'

      showSubmissionToast('error', apiMessage)
    } finally {
      setIsBankSubmitting(false)
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          Signed-in valuation
        </Badge>
        <Heading>{headingByRole[resolvedRole] || 'Create new evaluation request'}</Heading>
        <Text color="gray.700">
          {descriptionByRole[resolvedRole] ||
            'Submit a valuation request from your account.'}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        {resolvedRole === 'client' ? (
          <Box as="form" onSubmit={handleClientSubmit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.ownerName)}>
                <FormLabel>Customer / Borrower name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiUser color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter customer or borrower name"
                    value={clientFormData.ownerName}
                    onChange={handleClientChange('ownerName')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{clientFieldErrors.ownerName}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.ownerPhoneNumber)}>
                <FormLabel>Customer / Borrower phone number</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiPhone color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={clientFormData.ownerPhoneNumber}
                    onChange={handleClientChange('ownerPhoneNumber')}
                    maxLength={10}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{clientFieldErrors.ownerPhoneNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(clientFieldErrors.ownerEmail)}>
                <FormLabel>Email ID</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMail color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="owner@email.com"
                    value={clientFormData.ownerEmail}
                    onChange={handleClientChange('ownerEmail')}
                  />
                </InputGroup>
                <FormErrorMessage>{clientFieldErrors.ownerEmail}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.visitingAddress)}>
                <FormLabel>Property visit address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMapPin color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    name="visitingAddress.address"
                    placeholder="House no., street, locality"
                    value={clientFormData.visitingAddress}
                    onChange={handleClientChange('visitingAddress')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{clientFieldErrors.visitingAddress}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(clientFieldErrors.ownerAddress)}>
                <FormLabel>Client address</FormLabel>
                <Input
                  placeholder="Customer or borrower address"
                  value={clientFormData.ownerAddress}
                  onChange={handleClientChange('ownerAddress')}
                />
                <FormErrorMessage>{clientFieldErrors.ownerAddress}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Pincode</FormLabel>
                <Input
                  inputMode="numeric"
                  placeholder="400001"
                  value={clientFormData.visitingPinCode}
                  onChange={handleClientChange('visitingPinCode')}
                />
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.visitingCity)}>
                <FormLabel>City</FormLabel>
                <Select
                  name="visitingAddress.city"
                  placeholder="Select city"
                  value={clientFormData.visitingCity}
                  onChange={handleClientChange('visitingCity')}
                  required
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{clientFieldErrors.visitingCity}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(clientFieldErrors.visitingState)}>
                <FormLabel>State</FormLabel>
                <Input
                  placeholder="State"
                  value={clientFormData.visitingState}
                  onChange={handleClientChange('visitingState')}
                />
                <FormErrorMessage>{clientFieldErrors.visitingState}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.propertyType)}>
                <FormLabel>Property type</FormLabel>
                <Select
                  placeholder="Choose property type"
                  value={clientFormData.propertyType}
                  onChange={handleClientChange('propertyType')}
                  required
                >
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{clientFieldErrors.propertyType}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.valuationPurpose)}>
                <FormLabel>Valuation purpose</FormLabel>
                <Select
                  placeholder="Choose reason"
                  value={clientFormData.valuationPurpose}
                  onChange={handleClientChange('valuationPurpose')}
                  required
                >
                  {VALUATION_PURPOSE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{clientFieldErrors.valuationPurpose}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(clientFieldErrors.targetReportDate)}>
                <FormLabel>Target report date</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={clientFormData.targetReportDate}
                    onChange={handleClientChange('targetReportDate')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{clientFieldErrors.targetReportDate}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl mt={6} isRequired>
              <FormLabel>Supporting documents and notes</FormLabel>
              <Textarea
                placeholder="Add document details and inspection notes"
                value={clientFormData.supportingDocumentsNotes}
                onChange={handleClientChange('supportingDocumentsNotes')}
                required
              />
            </FormControl>

            <SupportingDocumentsSection
              filesByField={clientSupportingDocuments}
              inputResetKeys={clientDocumentInputResetKeys}
              offlineSelectionsByField={clientOfflineDocuments}
              onFilesChange={handleClientSupportingDocumentChange}
              onOfflineChange={handleClientOfflineDocumentChange}
              onSelectAllOffline={handleClientSelectAllOfflineDocuments}
              accentColorScheme="teal"
              errorMessage={clientFieldErrors.supportingDocuments}
            />

            <Stack spacing={4} mt={6}>
              <Button colorScheme="teal" size="lg" type="submit" isLoading={isClientSubmitting}>
                Submit request
              </Button>
              <Button as={RouterLink} to="/workspace/reports" variant="link" colorScheme="teal">
                View reports
              </Button>
            </Stack>
          </Box>
        ) : null}

        {resolvedRole === 'banker' ? (
          <Box as="form" onSubmit={handleBankSubmit}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Case reference</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiFileText color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    placeholder="Loan/case reference"
                    value={bankFormData.caseReference}
                    onChange={handleBankChange('caseReference')}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Customer / Borrower name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiUser color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    placeholder="Enter customer or borrower name"
                    value={bankFormData.borrowerName}
                    onChange={handleBankChange('borrowerName')}
                    required
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Email ID</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMail color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="client@email.com"
                    value={bankFormData.borrowerEmail}
                    onChange={handleBankChange('borrowerEmail')}
                  />
                </InputGroup>
                <FormErrorMessage>{bankFieldErrors.borrowerEmail}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.borrowerPhoneNumber)}>
                <FormLabel>Customer / Borrower phone number</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiPhone color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={bankFormData.borrowerPhoneNumber}
                    onChange={handleBankChange('borrowerPhoneNumber')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{bankFieldErrors.borrowerPhoneNumber}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.visitingAddress)}>
                <FormLabel>Property visit address</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiMapPin color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    name="visitingAddress.address"
                    placeholder="House no., street, locality"
                    value={bankFormData.visitingAddress}
                    onChange={handleBankChange('visitingAddress')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{bankFieldErrors.visitingAddress}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(bankFieldErrors.borrowerAddress)}>
                <FormLabel>Customer / Borrower address</FormLabel>
                <Input
                  placeholder="Customer or borrower address"
                  value={bankFormData.borrowerAddress}
                  onChange={handleBankChange('borrowerAddress')}
                />
                <FormErrorMessage>{bankFieldErrors.borrowerAddress}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(bankFieldErrors.visitingPinCode)}>
                <FormLabel>Pincode</FormLabel>
                <Input
                  inputMode="numeric"
                  placeholder="400001"
                  value={bankFormData.visitingPinCode}
                  onChange={handleBankChange('visitingPinCode')}
                />
                <FormErrorMessage>{bankFieldErrors.visitingPinCode}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.visitingCity)}>
                <FormLabel>City</FormLabel>
                <Select
                  name="visitingAddress.city"
                  placeholder="Select city"
                  value={bankFormData.visitingCity}
                  onChange={handleBankChange('visitingCity')}
                  required
                >
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{bankFieldErrors.visitingCity}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(bankFieldErrors.visitingState)}>
                <FormLabel>State</FormLabel>
                <Input
                  placeholder="State"
                  value={bankFormData.visitingState}
                  onChange={handleBankChange('visitingState')}
                />
                <FormErrorMessage>{bankFieldErrors.visitingState}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.propertyType)}>
                <FormLabel>Property type</FormLabel>
                <Select
                  placeholder="Choose property type"
                  value={bankFormData.propertyType}
                  onChange={handleBankChange('propertyType')}
                  required
                >
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{bankFieldErrors.propertyType}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.valuationPurpose)}>
                <FormLabel>Valuation purpose</FormLabel>
                <Select
                  placeholder="Choose reason"
                  value={bankFormData.valuationPurpose}
                  onChange={handleBankChange('valuationPurpose')}
                  required
                >
                  {VALUATION_PURPOSE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{bankFieldErrors.valuationPurpose}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={Boolean(bankFieldErrors.requiredLoanAmount)}>
                <FormLabel>Required loan amount (INR)</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FaRupeeSign color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Loan amount"
                    value={bankFormData.requiredLoanAmount}
                    onChange={handleBankChange('requiredLoanAmount')}
                  />
                </InputGroup>
                <FormErrorMessage>{bankFieldErrors.requiredLoanAmount}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={Boolean(bankFieldErrors.targetReportDate)}>
                <FormLabel>Target report date</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <FiCalendar color="#94a3b8" />
                  </InputLeftElement>
                  <Input
                    type="date"
                    value={bankFormData.targetReportDate}
                    onChange={handleBankChange('targetReportDate')}
                    required
                  />
                </InputGroup>
                <FormErrorMessage>{bankFieldErrors.targetReportDate}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            <FormControl mt={6} isRequired isInvalid={Boolean(bankFieldErrors.supportingDocumentsNotes)}>
              <FormLabel>Supporting documents and notes</FormLabel>
              <Textarea
                placeholder="Add borrower documents, urgency, or branch notes"
                value={bankFormData.supportingDocumentsNotes}
                onChange={handleBankChange('supportingDocumentsNotes')}
                required
              />
              <FormErrorMessage>{bankFieldErrors.supportingDocumentsNotes}</FormErrorMessage>
            </FormControl>

            <SupportingDocumentsSection
              filesByField={bankSupportingDocuments}
              inputResetKeys={bankDocumentInputResetKeys}
              offlineSelectionsByField={bankOfflineDocuments}
              onFilesChange={handleBankSupportingDocumentChange}
              onOfflineChange={handleBankOfflineDocumentChange}
              onSelectAllOffline={handleBankSelectAllOfflineDocuments}
              accentColorScheme="orange"
              errorMessage={bankFieldErrors.supportingDocuments}
            />

            <Stack spacing={4} mt={6}>
              <Button colorScheme="orange" size="lg" type="submit" isLoading={isBankSubmitting}>
                Submit request
              </Button>
              <Button as={RouterLink} to="/workspace/reports" variant="link" colorScheme="teal">
                View reports
              </Button>
            </Stack>
          </Box>
        ) : null}

        {!resolvedRole ? (
          <Stack spacing={4}>
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              Could not detect your account type. Please log in again.
            </Alert>
            <Button as={RouterLink} to="/login" colorScheme="teal" alignSelf="flex-start">
              Go to login
            </Button>
          </Stack>
        ) : null}
      </Box>
    </Stack>
  )
}

export default NewEvaluation
