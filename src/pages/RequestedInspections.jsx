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
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
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
  headingClient: 'Your valuation requests',
  headingBanker: 'Bank valuation requests',
  subheadingClient: 'View all valuation requests sent from your account.',
  subheadingBanker: 'View all valuation requests submitted from your bank account.',
  subheadingNoAccess: 'This page is only available for signed-in client or banker accounts.',
  accessDenied: 'Only client and banker accounts can view inspection requests.',
  loading: 'Loading requests...',
  empty: 'No valuation requests found yet.',
  refresh: 'Refresh',
  searchPlaceholder: 'Search by name, email, phone, or city',
  search: 'Search',
  statusFilter: 'Status',
  pageSize: 'Rows per page',
  previous: 'Previous',
  next: 'Next',
  pageLabel: 'Page',
  viewDetails: 'View details',
  delete: 'Delete',
  reference: 'Request ID',
  owner: 'Customer / Borrower details',
  propertyType: 'Property type',
  purpose: 'Valuation purpose',
  status: 'Status',
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
  return apiClient.delete(`${API_ENDPOINTS.inspections.detail}/${requestId}`, {
    withCredentials: true,
  })
}

function RequestedInspections() {
  const { authRole, user } = useAuth()
  const [inspectionRequests, setInspectionRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [selectedDeleteRequest, setSelectedDeleteRequest] = useState(null)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)
  const [successModalMessage, setSuccessModalMessage] = useState('')

  const resolvedRole = useMemo(() => resolveAuthRole(user?.role, authRole), [authRole, user?.role])
  const isClient = resolvedRole === 'client'
  const isBanker = resolvedRole === 'banker'
  const canViewRequests = isClient || isBanker
  const canManageRequests = canViewRequests

  const fetchInspectionRequests = useCallback(async () => {
    if (!canViewRequests) {
      setInspectionRequests([])
      setErrorMessage('')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await apiClient.get(API_ENDPOINTS.inspections.detail, {
        withCredentials: true,
        params: {
          page,
          limit,
          q: searchQuery.trim(),
          status: statusFilter,
        },
      })
      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || REQUESTS_TEXT.loadFailed)
      }

      const nextRequests = Array.isArray(apiResponse.data) ? apiResponse.data : []
      setInspectionRequests(nextRequests)
      setHasNextPage(nextRequests.length === limit)
    } catch (error) {
      if (error?.response?.status === 404) {
        setInspectionRequests([])
        setHasNextPage(false)
        setErrorMessage('')
        return
      }

      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        REQUESTS_TEXT.loadFailed

      setInspectionRequests([])
      setHasNextPage(false)
      setErrorMessage(apiMessage)
    } finally {
      setIsLoading(false)
    }
  }, [canViewRequests, limit, page, searchQuery, statusFilter])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    setPage(1)
  }

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value)
    setPage(1)
  }

  const handleLimitChange = (event) => {
    setLimit(Number(event.target.value))
    setPage(1)
  }

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
      setHasNextPage(false)
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
    if (!canViewRequests) {
      setInspectionRequests([])
      setErrorMessage('')
      setIsLoading(false)
      return
    }

    fetchInspectionRequests()
  }, [canViewRequests, fetchInspectionRequests])

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {REQUESTS_TEXT.badge}
        </Badge>
        <Heading>{isBanker ? REQUESTS_TEXT.headingBanker : REQUESTS_TEXT.headingClient}</Heading>
        <Text color="gray.700">
          {canViewRequests
            ? isBanker
              ? REQUESTS_TEXT.subheadingBanker
              : REQUESTS_TEXT.subheadingClient
            : REQUESTS_TEXT.subheadingNoAccess}
        </Text>
      </Stack>

      {!canViewRequests ? (
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
          <Stack spacing={4} px={{ base: 4, md: 6 }} py={4} bg="blackAlpha.50">
            <HStack justify="space-between" flexWrap="wrap" spacing={3}>
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

            <HStack align="flex-end" spacing={3} flexWrap="wrap">
              <Box minW={{ base: '100%', md: '320px' }}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1.5}>
                  {REQUESTS_TEXT.search}
                </Text>
                <Input
                  bg="white"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={REQUESTS_TEXT.searchPlaceholder}
                />
              </Box>

              <Box minW={{ base: '170px', md: '190px' }}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1.5}>
                  {REQUESTS_TEXT.statusFilter}
                </Text>
                <Select bg="white" value={statusFilter} onChange={handleStatusChange}>
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="all">All</option>
                </Select>
              </Box>

              <Box minW={{ base: '150px', md: '170px' }}>
                <Text fontSize="sm" fontWeight="600" color="gray.700" mb={1.5}>
                  {REQUESTS_TEXT.pageSize}
                </Text>
                <Select bg="white" value={String(limit)} onChange={handleLimitChange}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </Select>
              </Box>
            </HStack>
          </Stack>

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
                    <Th>{REQUESTS_TEXT.status}</Th>
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
                          <Text fontWeight="600">{request.ownerName || request.borrowerName || '--'}</Text>
                          <Text color="gray.600" fontSize="sm">
                            {request.ownerEmail || request.borrowerEmail || '--'}
                          </Text>
                          <Text color="gray.600" fontSize="sm">
                            {request.ownerPhoneNumber || request.borrowerPhoneNumber
                              ? String(request.ownerPhoneNumber || request.borrowerPhoneNumber)
                              : '--'}
                          </Text>
                        </Stack>
                      </Td>
                      <Td>{request.propertyType || '--'}</Td>
                      <Td>{request.valuationPurpose || '--'}</Td>
                      <Td>
                        <Badge colorScheme={request.status === 'completed' ? 'teal' : request.status === 'cancelled' ? 'red' : 'orange'}>
                          {request.status || 'pending'}
                        </Badge>
                      </Td>
                      <Td>{formatDate(request.targetReportDate || request.targeReportDate)}</Td>
                      <Td>{formatDate(request.createdAt)}</Td>
                      <Td minW={{ base: '220px', md: '280px' }} textAlign="right">
                        <ButtonGroup w="100%" justifyContent="flex-end" spacing={2}>
                          {canManageRequests ? (
                            <Button
                              as={RouterLink}
                              to={`/workspace/requested-inspections/${request._id}`}
                              size="sm"
                              variant="outline"
                              leftIcon={<FiEye />}
                            >
                              {REQUESTS_TEXT.viewDetails}
                            </Button>
                          ) : null}
                          {canManageRequests ? (
                            <Button
                              size="sm"
                              colorScheme="red"
                              variant="outline"
                              leftIcon={<FiTrash2 />}
                              onClick={() => handleOpenDeleteModal(request)}
                            >
                              {REQUESTS_TEXT.delete}
                            </Button>
                          ) : null}
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
                  {inspectionRequests.length === 0 ? (
                    <Tr>
                      <Td colSpan={7}>
                        <Text color="gray.600">{REQUESTS_TEXT.empty}</Text>
                      </Td>
                    </Tr>
                  ) : null}
                </Tbody>
              </Table>
            </TableContainer>
          )}

          {canViewRequests && !isLoading ? (
            <HStack justify="space-between" px={{ base: 4, md: 6 }} py={4} borderTop="1px solid" borderColor="blackAlpha.100">
              <Text color="gray.600" fontSize="sm">
                {REQUESTS_TEXT.pageLabel} {page}
              </Text>
              <ButtonGroup>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  isDisabled={page === 1}
                >
                  {REQUESTS_TEXT.previous}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPage((previous) => previous + 1)}
                  isDisabled={!hasNextPage}
                >
                  {REQUESTS_TEXT.next}
                </Button>
              </ButtonGroup>
            </HStack>
          ) : null}
        </Box>
      )}

      <Modal
        isOpen={canManageRequests && Boolean(selectedDeleteRequest)}
        onClose={handleCloseDeleteModal}
        isCentered
      >
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
