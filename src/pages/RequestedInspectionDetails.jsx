import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Spinner,
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
import apiClient from '../api/apiClient.js'
import { API_ENDPOINTS } from '../api/endpoints.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiExternalLink,
  FiFile,
  FiFileText,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
} from 'react-icons/fi'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { resolveAuthRole } from '../auth/authUtils.js'
const REQUEST_DETAILS_TEXT = {
  badge: 'Inspection request details',
  heading: 'Inspection request details',
  subheading: 'Check full request details and review uploaded or physically submitted documents.',
  back: 'Back to requests',
  accessDenied: 'Only client and banker accounts can view request details.',
  requestId: 'Request ID',
  ownerName: 'Customer / Borrower name',
  ownerEmail: 'Email ID',
  ownerPhone: 'Phone number',
  propertyType: 'Property type',
  purpose: 'Valuation purpose',
  targetDate: 'Target report date',
  createdOn: 'Requested on',
  visitAddress: 'Property visit address',
  clientAddress: 'Client address',
  documentsHeading: 'Supporting documents',
  documentsSubheading:
    'View uploaded files here, and check which documents will be submitted physically.',
  documentsTableHeading: 'Supporting document list',
  documentsTableSubheading: 'Review every required document and its latest available details.',
  documentsEmpty: 'No supporting documents found for this request.',
  preview: 'Preview',
  uploadedOn: 'Uploaded on',
  unknownFile: 'Uploaded file',
  physicalSubmission: 'Physical submission',
  physicalSubmissionMessage: 'This document will be submitted physically.',
  uploadedSubmission: 'Uploaded',
  noDetails: 'No details',
  documentColumn: 'Document',
  statusColumn: 'Status',
  fileColumn: 'File details',
  submissionColumn: 'Submission',
  previewColumn: 'Preview',
  categories: 'Categories',
  uploaded: 'Uploaded',
  physical: 'Physical',
  invalidRequest: 'Invalid request selected.',
  loadFailed: 'Unable to load request details right now.',
  refresh: 'Refresh',
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

const formatDate = (value) => {
  if (!value) {
    return '--'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return '--'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

const getAddressLabel = (addressDetails) => {
  if (!addressDetails || typeof addressDetails !== 'object') {
    return '--'
  }

  const addressSegments = [
    addressDetails.address,
    addressDetails.addressLine1,
    addressDetails.addressLine2,
    addressDetails.landmark,
    addressDetails.city,
    addressDetails.state,
    addressDetails.pinCode,
  ].filter(Boolean)

  return addressSegments.length ? addressSegments.join(', ') : '--'
}

const getDisplayValue = (value) => {
  if (value === null || value === undefined) {
    return '--'
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || '--'
}

const DetailItem = ({ icon, label, value, ...boxProps }) => (
  <Box
    border="1px solid"
    borderColor="blackAlpha.200"
    borderRadius="16px"
    bg="white"
    px={{ base: 3.5, md: 4 }}
    py={3.5}
    {...boxProps}
  >
    <HStack spacing={2} color="gray.500" mb={1.5}>
      <Icon as={icon} boxSize={4} />
      <Text fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="0.08em">
        {label}
      </Text>
    </HStack>
    <Text fontWeight="600" color="gray.800" wordBreak="break-word">
      {value}
    </Text>
  </Box>
)

function RequestedInspectionDetails() {
  const { authRole, user } = useAuth()
  const { requestId } = useParams()
  const [requestDetails, setRequestDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const resolvedRole = useMemo(() => resolveAuthRole(user?.role, authRole), [authRole, user?.role])
  const isClient = resolvedRole === 'client'
  const isBanker = resolvedRole === 'banker'
  const canViewRequestDetails = isClient || isBanker

  const documentTableRows = useMemo(() => {
    const documents = requestDetails?.supportingDocuments

    return supportingDocumentFields.map(({ name, label }) => {
      const value = documents?.[name]
      const isOffline = Boolean(documents?.[`${name}_offline`])
      const normalizedFiles = Array.isArray(value)
        ? value.filter(Boolean)
        : value && typeof value === 'object'
          ? [value]
          : []

      const hasFiles = normalizedFiles.length > 0
      const status = hasFiles
        ? REQUEST_DETAILS_TEXT.uploadedSubmission
        : isOffline
          ? REQUEST_DETAILS_TEXT.physicalSubmission
          : REQUEST_DETAILS_TEXT.noDetails
      const submission = isOffline
        ? REQUEST_DETAILS_TEXT.physicalSubmission
        : hasFiles
          ? REQUEST_DETAILS_TEXT.uploadedSubmission
          : REQUEST_DETAILS_TEXT.noDetails

      return {
        key: name,
        label,
        status,
        submission,
        files: normalizedFiles,
      }
    })
  }, [requestDetails?.supportingDocuments])

  const totalDocumentCount = useMemo(
    () => documentTableRows.filter((row) => row.status !== REQUEST_DETAILS_TEXT.noDetails).length,
    [documentTableRows],
  )

  const fetchRequestDetails = useCallback(async () => {
    if (!requestId) {
      setErrorMessage(REQUEST_DETAILS_TEXT.invalidRequest)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get(`${API_ENDPOINTS.inspections.detail}/${requestId}`, {
        withCredentials: true,
      })

      const apiResponse = response?.data ?? {}

      if (!apiResponse.success || !apiResponse.data) {
        throw new Error(apiResponse.message || REQUEST_DETAILS_TEXT.loadFailed)
      }

      setRequestDetails(apiResponse.data)
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        REQUEST_DETAILS_TEXT.loadFailed

      setRequestDetails(null)
      setErrorMessage(apiMessage)
    } finally {
      setIsLoading(false)
    }
  }, [requestId])

  useEffect(() => {
    if (!canViewRequestDetails) {
      setIsLoading(false)
      setErrorMessage('')
      return
    }

    fetchRequestDetails()
  }, [canViewRequestDetails, fetchRequestDetails])

  return (
    <Stack spacing={6}>
      <Box
        borderRadius="24px"
        p={{ base: 4, md: 6 }}
        bgGradient="linear(to-r, rgba(39, 152, 145, 0.12), rgba(39, 152, 145, 0.04))"
        border="1px solid"
        borderColor="teal.100"
      >
        <Stack spacing={5}>
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', md: 'center' }}
            gap={4}
            wrap="wrap"
          >
            <Stack spacing={2.5} maxW="3xl">
              <Badge colorScheme="teal" variant="subtle" w="fit-content">
                {REQUEST_DETAILS_TEXT.badge}
              </Badge>
              <Heading size={{ base: 'lg', md: 'xl' }}>{REQUEST_DETAILS_TEXT.heading}</Heading>
              <Text color="gray.700">{REQUEST_DETAILS_TEXT.subheading}</Text>
            </Stack>

            <Button
              as={RouterLink}
              to="/workspace/requested-inspections"
              variant="outline"
              leftIcon={<FiArrowLeft />}
            >
              {REQUEST_DETAILS_TEXT.back}
            </Button>
          </Flex>

          {canViewRequestDetails && !isLoading && requestDetails ? (
            <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
              <DetailItem
                icon={FiFileText}
                label={REQUEST_DETAILS_TEXT.requestId}
                value={getDisplayValue(requestDetails._id)}
              />
              <DetailItem
                icon={FiClock}
                label={REQUEST_DETAILS_TEXT.createdOn}
                value={formatDate(requestDetails.createdAt)}
              />
              <DetailItem
                icon={FiFile}
                label={REQUEST_DETAILS_TEXT.documentsHeading}
                value={String(totalDocumentCount)}
              />
            </SimpleGrid>
          ) : null}
        </Stack>
      </Box>

      {!canViewRequestDetails ? (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          {REQUEST_DETAILS_TEXT.accessDenied}
        </Alert>
      ) : null}

      {canViewRequestDetails && errorMessage ? (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Stack spacing={3}>
            <Text>{errorMessage}</Text>
            <Button
              size="sm"
              alignSelf="flex-start"
              onClick={fetchRequestDetails}
              variant="outline"
              colorScheme="red"
            >
              {REQUEST_DETAILS_TEXT.refresh}
            </Button>
          </Stack>
        </Alert>
      ) : null}

      {canViewRequestDetails && isLoading ? (
        <HStack justify="center" py={10}>
          <Spinner color="teal.500" thickness="4px" />
        </HStack>
      ) : null}

      {canViewRequestDetails && !isLoading && requestDetails ? (
        <Stack spacing={6}>
          <Box
            bg="whiteAlpha.900"
            borderRadius="24px"
            boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
            p={{ base: 4, md: 6 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={4}>
              <DetailItem
                icon={FiFileText}
                label={REQUEST_DETAILS_TEXT.requestId}
                value={getDisplayValue(requestDetails._id)}
              />
              <DetailItem
                icon={FiUser}
                label={REQUEST_DETAILS_TEXT.ownerName}
                value={getDisplayValue(requestDetails.ownerName || requestDetails.borrowerName)}
              />
              <DetailItem
                icon={FiMail}
                label={REQUEST_DETAILS_TEXT.ownerEmail}
                value={getDisplayValue(requestDetails.ownerEmail || requestDetails.borrowerEmail)}
              />
              <DetailItem
                icon={FiPhone}
                label={REQUEST_DETAILS_TEXT.ownerPhone}
                value={
                  requestDetails.ownerPhoneNumber || requestDetails.borrowerPhoneNumber
                    ? String(requestDetails.ownerPhoneNumber || requestDetails.borrowerPhoneNumber)
                    : '--'
                }
              />
              <DetailItem
                icon={FiFile}
                label={REQUEST_DETAILS_TEXT.propertyType}
                value={getDisplayValue(requestDetails.propertyType)}
              />
              <DetailItem
                icon={FiFile}
                label={REQUEST_DETAILS_TEXT.purpose}
                value={getDisplayValue(requestDetails.valuationPurpose)}
              />
              <DetailItem
                icon={FiCalendar}
                label={REQUEST_DETAILS_TEXT.targetDate}
                value={formatDate(requestDetails.targetReportDate || requestDetails.targeReportDate)}
              />
              <DetailItem
                icon={FiClock}
                label={REQUEST_DETAILS_TEXT.createdOn}
                value={formatDate(requestDetails.createdAt)}
              />
              <DetailItem
                icon={FiMapPin}
                label={REQUEST_DETAILS_TEXT.visitAddress}
                value={getAddressLabel(requestDetails.visitingAddress || requestDetails.propertyAddress)}
              />
              <DetailItem
                icon={FiMapPin}
                label={REQUEST_DETAILS_TEXT.clientAddress}
                value={getDisplayValue(requestDetails.ownerAddress || requestDetails.borrowerAddress)}
                gridColumn={{ base: 'auto', md: 'span 2', xl: 'auto' }}
              />
            </SimpleGrid>
          </Box>

          <Box
            bg="whiteAlpha.900"
            borderRadius="24px"
            boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
            p={{ base: 4, md: 6 }}
          >
            <Stack spacing={5}>
              <Stack spacing={1}>
                <Heading size="md">{REQUEST_DETAILS_TEXT.documentsTableHeading}</Heading>
                <Text color="gray.600">{REQUEST_DETAILS_TEXT.documentsTableSubheading}</Text>
              </Stack>

              <TableContainer
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="20px"
                overflow="hidden"
              >
                <Table variant="simple" size="md" minW={{ base: '960px', xl: '100%' }}>
                  <Thead bg="blackAlpha.50">
                    <Tr>
                      <Th>{REQUEST_DETAILS_TEXT.documentColumn}</Th>
                      <Th>{REQUEST_DETAILS_TEXT.statusColumn}</Th>
                      <Th>{REQUEST_DETAILS_TEXT.fileColumn}</Th>
                      <Th>{REQUEST_DETAILS_TEXT.uploadedOn}</Th>
                      <Th>{REQUEST_DETAILS_TEXT.submissionColumn}</Th>
                      <Th textAlign="right">{REQUEST_DETAILS_TEXT.previewColumn}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {documentTableRows.map((row) => (
                      <Tr key={row.key} _hover={{ bg: 'blackAlpha.50' }}>
                        <Td fontWeight="600" color="gray.900">
                          {row.label}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              row.status === REQUEST_DETAILS_TEXT.uploadedSubmission
                                ? 'green'
                                : row.status === REQUEST_DETAILS_TEXT.physicalSubmission
                                  ? 'orange'
                                  : 'gray'
                            }
                            variant="subtle"
                            px={2.5}
                            py={1}
                            borderRadius="full"
                          >
                            {row.status}
                          </Badge>
                        </Td>
                        <Td>
                          {row.files.length > 0 ? (
                            <Stack spacing={1.5}>
                              {row.files.map((file, index) => (
                                <Text key={`${row.key}-file-${file?.publicId || index}`} fontSize="sm" color="gray.700">
                                  {getDisplayValue(file?.publicId) === '--'
                                    ? REQUEST_DETAILS_TEXT.unknownFile
                                    : getDisplayValue(file?.publicId)}
                                </Text>
                              ))}
                            </Stack>
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              {REQUEST_DETAILS_TEXT.noDetails}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          {row.files.length > 0 ? (
                            <Stack spacing={1.5}>
                              {row.files.map((file, index) => (
                                <Text key={`${row.key}-date-${file?.uploadedAt || index}`} fontSize="sm" color="gray.700">
                                  {file?.uploadedAt
                                    ? formatDate(file.uploadedAt)
                                    : REQUEST_DETAILS_TEXT.noDetails}
                                </Text>
                              ))}
                            </Stack>
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              {REQUEST_DETAILS_TEXT.noDetails}
                            </Text>
                          )}
                        </Td>
                        <Td>
                          <Text fontSize="sm" color={row.submission === REQUEST_DETAILS_TEXT.physicalSubmission ? 'orange.700' : 'gray.700'}>
                            {row.submission}
                          </Text>
                        </Td>
                        <Td textAlign="right">
                          {row.files.length > 0 ? (
                            <Stack spacing={2} align="flex-end">
                              {row.files.map((file, index) => (
                                <Button
                                  key={`${row.key}-preview-${file?.url || index}`}
                                  as={Link}
                                  href={file?.url || ''}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  variant="outline"
                                  colorScheme="teal"
                                  rightIcon={<FiExternalLink />}
                                  isDisabled={!file?.url}
                                >
                                  {REQUEST_DETAILS_TEXT.preview}
                                </Button>
                              ))}
                            </Stack>
                          ) : (
                            <Text fontSize="sm" color="gray.500">
                              {REQUEST_DETAILS_TEXT.noDetails}
                            </Text>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </Stack>
  )
}

export default RequestedInspectionDetails
