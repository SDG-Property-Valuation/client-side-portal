import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import apiClient from '../api/apiClient.js'
import { API_ENDPOINTS } from '../api/endpoints.js'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { FiBriefcase, FiLock, FiUser } from 'react-icons/fi'
import { useAuth } from '../auth/AuthProvider.jsx'
import { normalizeAuthRole } from '../auth/authUtils.js'
import WelcomeBack from './WelcomeBack.jsx'
import * as yup from 'yup'

const loginSchema = yup
  .object({
    email: yup.string().trim().email('Please enter a valid email').required('Please enter email'),
    password: yup.string().required('Please enter password'),
  })
  .required()

function Login() {
  const { authRole, isAuthenticated, isAuthLoading, login, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectTo = location.state?.from?.pathname || '/workspace/reports'

  const [personalLoginMessage, setPersonalLoginMessage] = useState({ type: '', text: '' })
  const [bankLoginMessage, setBankLoginMessage] = useState({ type: '', text: '' })

  const personalForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const bankForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const hasSavedSession = Boolean(user && authRole)

  if (isAuthLoading && hasSavedSession) {
    return <WelcomeBack redirectTo={redirectTo} isCheckingSession />
  }

  if (isAuthenticated) {
    return <WelcomeBack redirectTo={redirectTo} />
  }

  const handleClientLogin = async (values) => {
    setBankLoginMessage({ type: '', text: '' })
    setPersonalLoginMessage({ type: '', text: '' })

    const payload = {
      email: values.email.trim(),
      password: values.password,
      role: 'client',
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.login, payload, { withCredentials: true })
      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        setPersonalLoginMessage({
          type: 'error',
          text: apiResponse.message || 'Login failed. Please check your email and password.',
        })
        return
      }

      const resolvedRole = normalizeAuthRole(apiResponse.data?.role) || 'client'
      const didStoreAuth = await login(resolvedRole, apiResponse.data)

      if (!didStoreAuth) {
        setPersonalLoginMessage({
          type: 'error',
          text: 'Login completed, but session check failed. Please try again.',
        })
        return
      }

      navigate(redirectTo, { replace: true })
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to log in right now. Please try again.'

      setPersonalLoginMessage({ type: 'error', text: apiMessage })
    }
  }

  const handleBankLogin = async (values) => {
    setPersonalLoginMessage({ type: '', text: '' })
    setBankLoginMessage({ type: '', text: '' })

    const payload = {
      email: values.email.trim(),
      password: values.password,
      role: 'banker',
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.login, payload, { withCredentials: true })
      const apiResponse = response?.data ?? {}

      if (!apiResponse.success) {
        setBankLoginMessage({
          type: 'error',
          text: apiResponse.message || 'Login failed. Please check your email and password.',
        })
        return
      }

      const resolvedRole = normalizeAuthRole(apiResponse.data?.role) || 'banker'
      const didStoreAuth = await login(resolvedRole, apiResponse.data)

      if (!didStoreAuth) {
        setBankLoginMessage({
          type: 'error',
          text: 'Login completed, but session check failed. Please try again.',
        })
        return
      }

      navigate(redirectTo, { replace: true })
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to log in right now. Please try again.'

      setBankLoginMessage({ type: 'error', text: apiMessage })
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          Login
        </Badge>
        <Heading>Log in to your account</Heading>
        <Text color="gray.700">
          Check your valuation requests, details, and updates.
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
          <TabList>
            <Tab>Customer</Tab>
            <Tab>Banker</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Box as="form" onSubmit={personalForm.handleSubmit(handleClientLogin)}>
                <Stack spacing={4}>
                  {personalLoginMessage.text ? (
                    <Alert
                      status={personalLoginMessage.type === 'success' ? 'success' : 'error'}
                      borderRadius="md"
                    >
                      <AlertIcon />
                      {personalLoginMessage.text}
                    </Alert>
                  ) : null}
                  <FormControl isRequired isInvalid={Boolean(personalForm.formState.errors.email)}>
                    <FormLabel>Email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiUser color="#94a3b8" />
                      </InputLeftElement>
                      <Input placeholder="Enter email" {...personalForm.register('email')} />
                    </InputGroup>
                    <FormErrorMessage>{personalForm.formState.errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={Boolean(personalForm.formState.errors.password)}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiLock color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...personalForm.register('password')}
                      />
                    </InputGroup>
                    <FormErrorMessage>{personalForm.formState.errors.password?.message}</FormErrorMessage>
                  </FormControl>
                  <Button
                    colorScheme="teal"
                    size="lg"
                    type="submit"
                    isLoading={personalForm.formState.isSubmitting}
                  >
                    Log in as customer
                  </Button>
                </Stack>
              </Box>
            </TabPanel>

            <TabPanel px={0}>
              <Box as="form" onSubmit={bankForm.handleSubmit(handleBankLogin)}>
                <Stack spacing={4}>
                  {bankLoginMessage.text ? (
                    <Alert status={bankLoginMessage.type === 'success' ? 'success' : 'error'} borderRadius="md">
                      <AlertIcon />
                      {bankLoginMessage.text}
                    </Alert>
                  ) : null}
                  <FormControl isRequired isInvalid={Boolean(bankForm.formState.errors.email)}>
                    <FormLabel>Banker email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiBriefcase color="#94a3b8" />
                      </InputLeftElement>
                      <Input placeholder="Enter bank email" {...bankForm.register('email')} />
                    </InputGroup>
                    <FormErrorMessage>{bankForm.formState.errors.email?.message}</FormErrorMessage>
                  </FormControl>
                  <FormControl isRequired isInvalid={Boolean(bankForm.formState.errors.password)}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiLock color="#94a3b8" />
                      </InputLeftElement>
                      <Input type="password" placeholder="Enter your password" {...bankForm.register('password')} />
                    </InputGroup>
                    <FormErrorMessage>{bankForm.formState.errors.password?.message}</FormErrorMessage>
                  </FormControl>
                  <Button
                    colorScheme="orange"
                    size="lg"
                    type="submit"
                    isLoading={bankForm.formState.isSubmitting}
                  >
                    Log in as banker
                  </Button>
                </Stack>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Stack spacing={2} mt={6}>
          {isAuthenticated ? (
            <Button
              as={RouterLink}
              to="/workspace/reports"
              colorScheme="teal"
              variant="outline"
              alignSelf="flex-start"
            >
              Open workspace
            </Button>
          ) : null}
          <Text color="gray.600">
            Need an account?{' '}
            <Button as={RouterLink} to="/register/customer" variant="link" colorScheme="teal">
              Sign up as customer
            </Button>
          </Text>
          <Text color="gray.600">
            Need a banker account?{' '}
            <Button as={RouterLink} to="/register/banker" variant="link" colorScheme="orange">
              Sign up as banker
            </Button>
          </Text>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Login
