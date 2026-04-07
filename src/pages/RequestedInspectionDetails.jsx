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
  Image,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
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
  subheading: 'Check full request details and view uploaded documents.',
  back: 'Back to requests',
  accessDenied: 'Only client accounts can view request details.',
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
  documentsSubheading: 'View files here or open any file in a new tab.',
  documentsEmpty: 'No supporting documents found for this request.',
  preview: 'Preview',
  uploadedOn: 'Uploaded on',
  unknownFile: 'Uploaded file',
  invalidRequest: 'Invalid request selected.',
  loadFailed: 'Unable to load request details right now.',
  refresh: 'Refresh',
}

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

const getReadableDocumentGroupName = (key) =>
  String(key)
    .replaceAll('_', ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())

const getFileExtension = (url = '') => {
  const normalizedUrl = String(url).split('?')[0].toLowerCase()
  const extension = normalizedUrl.split('.').pop()
  return extension || ''
}

const getDisplayValue = (value) => {
  if (value === null || value === undefined) {
    return '--'
  }

  const normalizedValue = String(value).trim()
  return normalizedValue || '--'
}

const isImageFile = (url = '') => ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(getFileExtension(url))
const isPdfFile = (url = '') => getFileExtension(url) === 'pdf'

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

  const documentGroups = useMemo(() => {
    if (!requestDetails?.supportingDocuments || typeof requestDetails.supportingDocuments !== 'object') {
      return []
    }

    return Object.entries(requestDetails.supportingDocuments)
      .map(([group, files]) => ({
        group,
        files: Array.isArray(files) ? files : [],
      }))
      .filter(({ files }) => files.length > 0)
  }, [requestDetails?.supportingDocuments])

  const totalDocumentCount = useMemo(
    () => documentGroups.reduce((total, group) => total + group.files.length, 0),
    [documentGroups],
  )

  const flattenedDocuments = useMemo(
    () =>
      documentGroups.flatMap(({ group, files }) =>
        files.map((file, index) => ({
          group,
          file,
          key: `${group}-${file?.publicId || file?.url || 'document'}-${file?.uploadedAt || index}-${index}`,
        })),
      ),
    [documentGroups],
  )

  const isClient = resolvedRole === 'client'

  const fetchRequestDetails = useCallback(async () => {
    if (!requestId) {
      setErrorMessage(REQUEST_DETAILS_TEXT.invalidRequest)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.client.requestedInspections}/${requestId}`,
        {
          withCredentials: true,
        },
      )

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
    if (!isClient) {
      setIsLoading(false)
      setErrorMessage('')
      return
    }

    fetchRequestDetails()
  }, [fetchRequestDetails, isClient])

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

          {isClient && !isLoading && requestDetails ? (
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

      {!isClient ? (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          {REQUEST_DETAILS_TEXT.accessDenied}
        </Alert>
      ) : null}

      {isClient && errorMessage ? (
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

      {isClient && isLoading ? (
        <HStack justify="center" py={10}>
          <Spinner color="teal.500" thickness="4px" />
        </HStack>
      ) : null}

      {isClient && !isLoading && requestDetails ? (
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
                value={getDisplayValue(requestDetails.ownerName)}
              />
              <DetailItem
                icon={FiMail}
                label={REQUEST_DETAILS_TEXT.ownerEmail}
                value={getDisplayValue(requestDetails.ownerEmail)}
              />
              <DetailItem
                icon={FiPhone}
                label={REQUEST_DETAILS_TEXT.ownerPhone}
                value={
                  requestDetails.ownerPhoneNumber
                    ? String(requestDetails.ownerPhoneNumber)
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
                value={getDisplayValue(requestDetails.ownerAddress)}
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
              <Flex
                justify="space-between"
                align={{ base: 'flex-start', md: 'center' }}
                gap={3}
                wrap="wrap"
              >
                <Stack spacing={1}>
                  <Heading size="md">{REQUEST_DETAILS_TEXT.documentsHeading}</Heading>
                  <Text color="gray.600">{REQUEST_DETAILS_TEXT.documentsSubheading}</Text>
                </Stack>

                <HStack spacing={2.5} flexWrap="wrap">
                  <HStack spacing={1.5} bg="teal.50" px={3} py={1.5} borderRadius="full">
                    <Icon as={FiFile} color="teal.700" boxSize={3.5} />
                    <Text fontSize="sm" fontWeight="700" color="teal.800">
                      {totalDocumentCount}
                    </Text>
                  </HStack>
                  <HStack spacing={1.5} bg="gray.50" px={3} py={1.5} borderRadius="full">
                    <Icon as={FiFileText} color="gray.600" boxSize={3.5} />
                    <Text fontSize="sm" fontWeight="700" color="gray.700">
                      {documentGroups.length}
                    </Text>
                  </HStack>
                </HStack>
              </Flex>

              {documentGroups.length === 0 ? (
                <Text color="gray.600">{REQUEST_DETAILS_TEXT.documentsEmpty}</Text>
              ) : (
                <SimpleGrid
                  columns={{
                    base: 1,
                    sm: 2,
                  }}
                  spacing={6}
                >
                  {flattenedDocuments.map(({ group, file, key }) => {
                    const fileUrl = file?.url || ''
                    const filePublicId =
                      getDisplayValue(file?.publicId) === '--'
                        ? REQUEST_DETAILS_TEXT.unknownFile
                        : getDisplayValue(file?.publicId)
                    const showImagePreview = isImageFile(fileUrl)
                    const showPdfPreview = isPdfFile(fileUrl)
                    const fileTypeLabel = getFileExtension(fileUrl).toUpperCase() || 'FILE'

                    return (
                      <Stack key={key} spacing={3.5}>
                        <Flex justify="space-between" align="flex-start" gap={2} wrap="wrap">
                          <Badge colorScheme="gray" variant="subtle">
                            {getReadableDocumentGroupName(group)}
                          </Badge>
                          <Badge colorScheme="teal" variant="outline">
                            {fileTypeLabel}
                          </Badge>
                        </Flex>

                        <Box
                          border="1px solid"
                          borderColor="blackAlpha.200"
                          borderRadius="10px"
                          overflow="hidden"
                          h="180px"
                          bg="gray.50"
                        >
                          {showImagePreview && fileUrl ? (
                            <Image
                              src={fileUrl}
                              alt={filePublicId}
                              w="100%"
                              h="100%"
                              objectFit="cover"
                            />
                          ) : null}

                          {showPdfPreview && fileUrl ? (
                            <Box
                              as="iframe"
                              src={fileUrl}
                              title={filePublicId}
                              w="100%"
                              h="100%"
                              border="0"
                              loading="lazy"
                            />
                          ) : null}

                          {!showImagePreview && !showPdfPreview ? (
                            <Stack h="100%" align="center" justify="center" spacing={1.5} color="gray.500">
                              <Icon as={FiFile} boxSize={6} />
                              <Text fontSize="xs" fontWeight="700" letterSpacing="0.06em">
                                {fileTypeLabel}
                              </Text>
                            </Stack>
                          ) : null}
                        </Box>

                        <Text fontWeight="700" color="gray.900" wordBreak="break-word">
                          {filePublicId}
                        </Text>

                        <Flex
                          justify="space-between"
                          align={{ base: 'flex-start', md: 'center' }}
                          gap={3}
                          wrap="wrap"
                        >
                          <HStack spacing={1.5} color="gray.600">
                            <Icon as={FiClock} boxSize={3.5} />
                            <Text fontSize="sm">
                              {REQUEST_DETAILS_TEXT.uploadedOn}: {formatDate(file?.uploadedAt)}
                            </Text>
                          </HStack>

                          <Button
                            as={Link}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            rightIcon={<FiExternalLink />}
                            isDisabled={!fileUrl}
                            colorScheme="teal"
                            variant="solid"
                          >
                            {REQUEST_DETAILS_TEXT.preview}
                          </Button>
                        </Flex>
                      </Stack>
                    )
                  })}
                </SimpleGrid>
              )}
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </Stack>
  )
}

export default RequestedInspectionDetails
