import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Divider,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
import { FiEye, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider.jsx'
import { resolveAuthRole } from '../auth/authUtils.js'
const REQUESTS_TEXT = {
  badge: 'Inspection requests',
  heading: 'Your valuation requests',
  subheading: 'View all valuation requests sent from your account.',
  subheadingNoAccess: 'This page is only available for client accounts.',
  accessDenied: 'Only client accounts can view inspection requests.',
  loading: 'Loading requests...',
  empty: 'No valuation requests found yet.',
  refresh: 'Refresh',
  viewDetails: 'View details',
  delete: 'Delete',
  reference: 'Request ID',
  owner: 'Customer / Borrower details',
  propertyType: 'Property type',
  purpose: 'Valuation purpose',
  targetDate: 'Target report date',
  requestedOn: 'Requested on',
  actions: 'Actions',
  loadFailed: 'Unable to load requests right now.',
  deleteFailed: 'Unable to delete this request right now.',
  deleteSuccess: 'Inspection request deleted successfully.',
  deleteTitle: 'Delete request',
  deleteBody: 'Do you want to delete this request? This cannot be undone.',
  cancel: 'Cancel',
  confirmDelete: 'Delete request',
  successTitle: 'Success',
  close: 'Close',
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

const attemptDeleteRequest = async (requestId) => {
  const urlCandidates = [
    `${API_ENDPOINTS.client.cancelRequestedInspections}/${requestId}`,
    `${API_ENDPOINTS.client.cancelRequestedInspections.replace('inspections', 'inspection')}/${requestId}`,
  ]
  const methodCandidates = ['delete', 'patch', 'post']
  let lastRouteError = null

  for (const url of urlCandidates) {
    for (const method of methodCandidates) {
      try {
        const response = await apiClient({
          method,
          url,
          data: method === 'delete' ? undefined : {},
          withCredentials: true,
        })

        return response
      } catch (error) {
        const statusCode = error?.response?.status

        if (statusCode === 404 || statusCode === 405) {
          lastRouteError = error
          continue
        }

        throw error
      }
    }
  }

  throw lastRouteError || new Error('Unable to reach delete endpoint')
}

function RequestedInspections() {
  const { authRole, user } = useAuth()
  const [inspectionRequests, setInspectionRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedDeleteRequest, setSelectedDeleteRequest] = useState(null)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState('')

  const resolvedRole = useMemo(() => resolveAuthRole(user?.role, authRole), [authRole, user?.role])

  const fetchInspectionRequests = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get(API_ENDPOINTS.client.requestedInspections, {
        withCredentials: true,
      })
      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || REQUESTS_TEXT.loadFailed)
      }

      setInspectionRequests(Array.isArray(apiResponse.data) ? apiResponse.data : [])
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        REQUESTS_TEXT.loadFailed

      setInspectionRequests([])
      setErrorMessage(apiMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleOpenDeleteModal = (request) => {
    setSelectedDeleteRequest(request)
  }

  const handleCloseDeleteModal = () => {
    if (isDeleteSubmitting) {
      return
    }

    setSelectedDeleteRequest(null)
  }

  const handleDeleteRequest = async () => {
    if (!selectedDeleteRequest?._id) {
      return
    }

    setIsDeleteSubmitting(true)
    setErrorMessage('')

    try {
      const response = await attemptDeleteRequest(selectedDeleteRequest._id)
      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || REQUESTS_TEXT.deleteFailed)
      }

      setInspectionRequests((previous) =>
        previous.filter((request) => request._id !== selectedDeleteRequest._id),
      )
      setSelectedDeleteRequest(null)
      setSuccessModalMessage(apiResponse.message || REQUESTS_TEXT.deleteSuccess)
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        REQUESTS_TEXT.deleteFailed

      setErrorMessage(apiMessage)
    } finally {
      setIsDeleteSubmitting(false)
    }
  }

  useEffect(() => {
    if (resolvedRole !== 'client') {
      setInspectionRequests([])
      setErrorMessage('')
      setIsLoading(false)
      return
    }

    fetchInspectionRequests()
  }, [fetchInspectionRequests, resolvedRole])

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {REQUESTS_TEXT.badge}
        </Badge>
        <Heading>{REQUESTS_TEXT.heading}</Heading>
        <Text color="gray.700">
          {resolvedRole === 'client' ? REQUESTS_TEXT.subheading : REQUESTS_TEXT.subheadingNoAccess}
        </Text>
      </Stack>

      {resolvedRole !== 'client' ? (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          {REQUESTS_TEXT.accessDenied}
        </Alert>
      ) : (
        <Box
          bg="whiteAlpha.900"
          borderRadius="24px"
          boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
          overflow="hidden"
        >
          <HStack justify="space-between" px={{ base: 4, md: 6 }} py={4} bg="blackAlpha.50">
            <Text color="gray.700" fontWeight="600">
              {isLoading ? REQUESTS_TEXT.loading : `${inspectionRequests.length} requests`}
            </Text>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={fetchInspectionRequests}
              isLoading={isLoading}
            >
              {REQUESTS_TEXT.refresh}
            </Button>
          </HStack>

          {errorMessage ? (
            <Alert status="error" borderRadius="0">
              <AlertIcon />
              {errorMessage}
            </Alert>
          ) : null}

          {isLoading ? (
            <HStack justify="center" py={10}>
              <Spinner color="teal.500" thickness="4px" />
            </HStack>
          ) : (
            <TableContainer w="100%" overflowX="auto">
              <Table
                variant="simple"
                size="md"
                minW={{ base: '980px', md: '1180px', xl: '1320px' }}
              >
                <Thead bg="blackAlpha.50">
                  <Tr>
                    <Th>{REQUESTS_TEXT.owner}</Th>
                    <Th>{REQUESTS_TEXT.propertyType}</Th>
                    <Th>{REQUESTS_TEXT.purpose}</Th>
                    <Th>{REQUESTS_TEXT.targetDate}</Th>
                    <Th>{REQUESTS_TEXT.requestedOn}</Th>
                    <Th textAlign="right">{REQUESTS_TEXT.actions}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inspectionRequests.map((request) => (
                    <Tr key={request._id || `${request.ownerEmail}-${request.createdAt}`} _hover={{ bg: 'blackAlpha.50' }}>
                      <Td minW={{ base: '220px', md: '260px' }}>
                        <Stack spacing={0.5}>
                          <Text fontWeight="600">{request.ownerName || '--'}</Text>
                          <Text color="gray.600" fontSize="sm">
                            {request.ownerEmail || '--'}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            {request.ownerPhoneNumber ? String(request.ownerPhoneNumber) : '--'}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>{request.propertyType || '--'}</Td>
                      <Td>{request.valuationPurpose || '--'}</Td>
                      <Td>{formatDate(request.targetReportDate || request.targeReportDate)}</Td>
                      <Td>{formatDate(request.createdAt)}</Td>
                      <Td minW={{ base: '220px', md: '280px' }} textAlign="right">
                        <ButtonGroup w="100%" justifyContent="flex-end" spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/workspace/requested-inspections/${request._id}`}
                            size="sm"
                            variant="outline"
                            leftIcon={<FiEye />}
                          >
                            {REQUESTS_TEXT.viewDetails}
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            variant="outline"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleOpenDeleteModal(request)}
                          >
                            {REQUESTS_TEXT.delete}
                          </Button>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
                  {inspectionRequests.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>
                        <Text color="gray.600">{REQUESTS_TEXT.empty}</Text>
                      </Td>
                    </Tr>
                  ) : null}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      <Modal isOpen={Boolean(selectedDeleteRequest)} onClose={handleCloseDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{REQUESTS_TEXT.deleteTitle}</ModalHeader>
          <ModalCloseButton isDisabled={isDeleteSubmitting} />
          <ModalBody>
            <Text>{REQUESTS_TEXT.deleteBody}</Text>
            <Divider my={3} />
            <Stack spacing={1}>
              <Text fontSize="sm" color="gray.600">
                {REQUESTS_TEXT.reference}
              </Text>
              <Text fontWeight="600">{selectedDeleteRequest?._id || '--'}</Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleCloseDeleteModal}
              isDisabled={isDeleteSubmitting}
            >
              {REQUESTS_TEXT.cancel}
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteRequest}
              isLoading={isDeleteSubmitting}
            >
              {REQUESTS_TEXT.confirmDelete}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={Boolean(successModalMessage)}
        onClose={() => setSuccessModalMessage('')}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{REQUESTS_TEXT.successTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{successModalMessage}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => setSuccessModalMessage('')}>
              {REQUESTS_TEXT.close}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
  )
}

export default RequestedInspections
