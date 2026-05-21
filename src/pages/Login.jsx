import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Circle,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
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
import { FiArrowRight, FiBriefcase, FiCheckCircle, FiKey, FiLock, FiMail, FiRefreshCw, FiUser } from 'react-icons/fi'
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

const forgotPasswordOtpSchema = yup
  .object({
    otp: yup
      .string()
      .transform((_, originalValue) => String(originalValue ?? '').replace(/\D/g, ''))
      .required('Please enter the verification code')
      .matches(/^\d{6}$/, 'Verification code should be 6 digits'),
  })
  .required()

const resetPasswordSchema = yup
  .object({
    newPassword: yup.string().required('Please enter a new password').min(6, 'Password should be at least 6 characters'),
  })
  .required()

function Login() {
  const { authRole, isAuthenticated, isAuthLoading, login, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const redirectTo = location.state?.from?.pathname || '/workspace/reports'

  const [personalLoginMessage, setPersonalLoginMessage] = useState({ type: '', text: '' })
  const [bankLoginMessage, setBankLoginMessage] = useState({ type: '', text: '' })
  const [isSendingPersonalResetOtp, setIsSendingPersonalResetOtp] = useState(false)
  const [isSendingBankResetOtp, setIsSendingBankResetOtp] = useState(false)
  const [forgotPasswordFlow, setForgotPasswordFlow] = useState({
    role: '',
    email: '',
    step: '',
    message: { type: '', text: '' },
    isResendingOtp: false,
  })

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

  const forgotPasswordOtpForm = useForm({
    resolver: yupResolver(forgotPasswordOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  const resetPasswordForm = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
    },
  })
  const hasSavedSession = Boolean(user && authRole)
  const forgotPasswordStepCards = [
    {
      id: 'otp',
      title: 'Verify code',
      description: 'Enter the 6-digit code sent to your email.',
      icon: FiMail,
    },
    {
      id: 'reset',
      title: 'Choose password',
      description: 'Create a fresh password and return to login.',
      icon: FiKey,
    },
  ]

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

  const handleForgotPasswordOtp = async ({
    email,
    role,
    setMessage,
    setLoading,
    emailErrorMessage,
    successFallback,
  }) => {
    setMessage({ type: '', text: '' })

    if (!email) {
      setMessage({ type: 'error', text: emailErrorMessage })
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.forgotPasswordSendOtp, {
        email: email.trim(),
        role,
      })

      const apiResponse = response?.data ?? {}
      setMessage({
        type: 'success',
        text: apiResponse.message || successFallback,
      })
      setForgotPasswordFlow({
        role,
        email: email.trim(),
        step: 'otp',
        message: {
          type: 'success',
          text: apiResponse.message || successFallback,
        },
        isResendingOtp: false,
      })
      forgotPasswordOtpForm.reset({ otp: '' })
      resetPasswordForm.reset({ newPassword: '' })
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to send verification code right now. Please try again.'

      setMessage({ type: 'error', text: apiMessage })
    } finally {
      setLoading(false)
    }
  }

  const handlePersonalForgotPassword = async () => {
    const isEmailValid = await personalForm.trigger('email')

    if (!isEmailValid) {
      return
    }

    const email = personalForm.getValues('email')

    await handleForgotPasswordOtp({
      email,
      role: 'individual',
      setMessage: setPersonalLoginMessage,
      setLoading: setIsSendingPersonalResetOtp,
      emailErrorMessage: 'Enter your email first to receive a verification code.',
      successFallback: `A 6-digit verification code was sent to ${email.trim()}.`,
    })
  }

  const handleBankForgotPassword = async () => {
    const isEmailValid = await bankForm.trigger('email')

    if (!isEmailValid) {
      return
    }

    const email = bankForm.getValues('email')

    await handleForgotPasswordOtp({
      email,
      role: 'banker',
      setMessage: setBankLoginMessage,
      setLoading: setIsSendingBankResetOtp,
      emailErrorMessage: 'Enter your banker email first to receive a verification code.',
      successFallback: `A 6-digit verification code was sent to ${email.trim()}.`,
    })
  }

  const closeForgotPasswordFlow = () => {
    setForgotPasswordFlow({
      role: '',
      email: '',
      step: '',
      message: { type: '', text: '' },
      isResendingOtp: false,
    })
    forgotPasswordOtpForm.reset({ otp: '' })
    resetPasswordForm.reset({ newPassword: '' })
  }

  const getForgotPasswordStepState = (stepId) => {
    if (!forgotPasswordFlow.step) {
      return 'upcoming'
    }

    if (stepId === forgotPasswordFlow.step) {
      return 'active'
    }

    if (stepId === 'otp' && forgotPasswordFlow.step === 'reset') {
      return 'complete'
    }

    return 'upcoming'
  }

  const handleVerifyForgotPasswordOtp = async ({ otp }) => {
    setForgotPasswordFlow((currentFlow) => ({
      ...currentFlow,
      message: { type: '', text: '' },
    }))

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.forgotPasswordVerifyOtp, {
        otp: Number(otp),
      })

      const apiResponse = response?.data ?? {}
      setForgotPasswordFlow((currentFlow) => ({
        ...currentFlow,
        step: 'reset',
        message: {
          type: 'success',
          text: apiResponse.message || 'Verification successful. Enter your new password.',
        },
      }))
      resetPasswordForm.reset({ newPassword: '' })
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Verification failed. Please check the code and try again.'

      setForgotPasswordFlow((currentFlow) => ({
        ...currentFlow,
        message: { type: 'error', text: apiMessage },
      }))
    }
  }

  const handleResendForgotPasswordOtp = async () => {
    setForgotPasswordFlow((currentFlow) => ({
      ...currentFlow,
      isResendingOtp: true,
      message: { type: '', text: '' },
    }))

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.forgotPasswordResendOtp)
      const apiResponse = response?.data ?? {}

      setForgotPasswordFlow((currentFlow) => ({
        ...currentFlow,
        step: 'otp',
        isResendingOtp: false,
        message: {
          type: 'success',
          text: apiResponse.message || `A new 6-digit verification code was sent to ${currentFlow.email}.`,
        },
      }))
      forgotPasswordOtpForm.reset({ otp: '' })
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to resend the verification code right now. Please try again.'

      setForgotPasswordFlow((currentFlow) => ({
        ...currentFlow,
        isResendingOtp: false,
        message: { type: 'error', text: apiMessage },
      }))
    }
  }

  const handleResetPassword = async ({ newPassword }) => {
    setForgotPasswordFlow((currentFlow) => ({
      ...currentFlow,
      message: { type: '', text: '' },
    }))

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.forgotPasswordResetPassword, {
        newPassword,
      })

      const apiResponse = response?.data ?? {}
      const successMessage = apiResponse.message || 'Password reset successful. You can now log in with your new password.'

      if (forgotPasswordFlow.role === 'banker') {
        setBankLoginMessage({ type: 'success', text: successMessage })
        setPersonalLoginMessage({ type: '', text: '' })
      } else {
        setPersonalLoginMessage({ type: 'success', text: successMessage })
        setBankLoginMessage({ type: '', text: '' })
      }

      closeForgotPasswordFlow()
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to reset password right now. Please try again.'

      setForgotPasswordFlow((currentFlow) => ({
        ...currentFlow,
        message: { type: 'error', text: apiMessage },
      }))
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
        <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={6} alignItems="start">
          <Box
            bg="white"
            borderRadius="22px"
            border="1px solid"
            borderColor="blackAlpha.100"
            p={{ base: 5, md: 6 }}
            boxShadow="0 10px 24px rgba(15, 23, 42, 0.05)"
          >
            <Tabs variant="soft-rounded" colorScheme="teal" isFitted>
              <TabList bg="gray.50" p="1" borderRadius="16px">
                <Tab _selected={{ bg: 'teal.500', color: 'white' }}>Individual</Tab>
                <Tab _selected={{ bg: 'orange.400', color: 'white' }}>Banker</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0} pt={6}>
                  <Box as="form" onSubmit={personalForm.handleSubmit(handleClientLogin)}>
                    <Stack spacing={5}>
                      {personalLoginMessage.text ? (
                        <Alert
                          status={personalLoginMessage.type === 'success' ? 'success' : 'error'}
                          borderRadius="xl"
                          bg={personalLoginMessage.type === 'success' ? 'teal.50' : 'red.50'}
                        >
                          <AlertIcon />
                          {personalLoginMessage.text}
                        </Alert>
                      ) : null}
                      <FormControl isRequired isInvalid={Boolean(personalForm.formState.errors.email)}>
                        <FormLabel>Email</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <FiUser color="#94a3b8" />
                          </InputLeftElement>
                          <Input
                            placeholder="Enter email"
                            bg="gray.50"
                            borderColor="transparent"
                            _hover={{ borderColor: 'teal.200' }}
                            _focusVisible={{ bg: 'white', borderColor: 'teal.400', boxShadow: '0 0 0 1px #319795' }}
                            {...personalForm.register('email')}
                          />
                        </InputGroup>
                        <FormErrorMessage>{personalForm.formState.errors.email?.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={Boolean(personalForm.formState.errors.password)}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <FiLock color="#94a3b8" />
                          </InputLeftElement>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            bg="gray.50"
                            borderColor="transparent"
                            _hover={{ borderColor: 'teal.200' }}
                            _focusVisible={{ bg: 'white', borderColor: 'teal.400', boxShadow: '0 0 0 1px #319795' }}
                            {...personalForm.register('password')}
                          />
                        </InputGroup>
                        <FormErrorMessage>{personalForm.formState.errors.password?.message}</FormErrorMessage>
                      </FormControl>
                      <HStack justify="space-between" align="center" wrap="wrap" spacing={3}>
                        <Button
                          variant="link"
                          colorScheme="teal"
                          rightIcon={<FiArrowRight />}
                          onClick={handlePersonalForgotPassword}
                          isLoading={isSendingPersonalResetOtp}
                        >
                          Forgot password?
                        </Button>
                        <Text fontSize="sm" color="gray.500">
                          We&apos;ll send a 6-digit code to your inbox.
                        </Text>
                      </HStack>
                      <Button
                        colorScheme="teal"
                        size="lg"
                        type="submit"
                        isLoading={personalForm.formState.isSubmitting}
                      >
                        Log in as individual
                      </Button>
                    </Stack>
                  </Box>
                </TabPanel>

                <TabPanel px={0} pt={6}>
                  <Box as="form" onSubmit={bankForm.handleSubmit(handleBankLogin)}>
                    <Stack spacing={5}>
                      {bankLoginMessage.text ? (
                        <Alert
                          status={bankLoginMessage.type === 'success' ? 'success' : 'error'}
                          borderRadius="xl"
                          bg={bankLoginMessage.type === 'success' ? 'orange.50' : 'red.50'}
                        >
                          <AlertIcon />
                          {bankLoginMessage.text}
                        </Alert>
                      ) : null}
                      <FormControl isRequired isInvalid={Boolean(bankForm.formState.errors.email)}>
                        <FormLabel>Banker email</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <FiBriefcase color="#94a3b8" />
                          </InputLeftElement>
                          <Input
                            placeholder="Enter bank email"
                            bg="gray.50"
                            borderColor="transparent"
                            _hover={{ borderColor: 'orange.200' }}
                            _focusVisible={{ bg: 'white', borderColor: 'orange.400', boxShadow: '0 0 0 1px #f6ad55' }}
                            {...bankForm.register('email')}
                          />
                        </InputGroup>
                        <FormErrorMessage>{bankForm.formState.errors.email?.message}</FormErrorMessage>
                      </FormControl>
                      <FormControl isRequired isInvalid={Boolean(bankForm.formState.errors.password)}>
                        <FormLabel>Password</FormLabel>
                        <InputGroup size="lg">
                          <InputLeftElement pointerEvents="none">
                            <FiLock color="#94a3b8" />
                          </InputLeftElement>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            bg="gray.50"
                            borderColor="transparent"
                            _hover={{ borderColor: 'orange.200' }}
                            _focusVisible={{ bg: 'white', borderColor: 'orange.400', boxShadow: '0 0 0 1px #f6ad55' }}
                            {...bankForm.register('password')}
                          />
                        </InputGroup>
                        <FormErrorMessage>{bankForm.formState.errors.password?.message}</FormErrorMessage>
                      </FormControl>
                      <HStack justify="space-between" align="center" wrap="wrap" spacing={3}>
                        <Button
                          variant="link"
                          colorScheme="orange"
                          rightIcon={<FiArrowRight />}
                          onClick={handleBankForgotPassword}
                          isLoading={isSendingBankResetOtp}
                        >
                          Forgot password?
                        </Button>
                        <Text fontSize="sm" color="gray.500">
                          Reset access without leaving this page.
                        </Text>
                      </HStack>
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
          </Box>

          <Box
            borderRadius="22px"
            p={{ base: 5, md: 6 }}
            bgGradient={
              forgotPasswordFlow.role === 'banker'
                ? 'linear(to-br, orange.50, white 50%, #fff7ed)'
                : 'linear(to-br, teal.50, white 52%, #f4fbfa)'
            }
            border="1px solid"
            borderColor={forgotPasswordFlow.role === 'banker' ? 'orange.100' : 'teal.100'}
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.75), 0 16px 30px rgba(15, 23, 42, 0.06)"
          >
            <Stack spacing={5}>
              <Stack spacing={2}>
                <Badge colorScheme={forgotPasswordFlow.role === 'banker' ? 'orange' : 'teal'} w="fit-content">
                  {forgotPasswordFlow.step ? 'Password recovery' : 'Quick recovery'}
                </Badge>
                <Heading size="md">
                  {forgotPasswordFlow.step ? 'Recover access in two short steps' : 'Need help getting back in?'}
                </Heading>
                <Text color="gray.600">
                  {forgotPasswordFlow.step
                    ? `We’re resetting access for ${forgotPasswordFlow.email}. Verify the code, then choose a new password.`
                    : 'Start from either login tab with your email and we’ll guide you through a clean reset flow here.'}
                </Text>
              </Stack>

              <Stack spacing={3}>
                {forgotPasswordStepCards.map((stepCard) => {
                  const stepState = getForgotPasswordStepState(stepCard.id)
                  const isActive = stepState === 'active'
                  const isComplete = stepState === 'complete'

                  return (
                    <HStack
                      key={stepCard.id}
                      align="start"
                      spacing={4}
                      p={4}
                      borderRadius="18px"
                      bg={isActive ? 'whiteAlpha.900' : 'whiteAlpha.700'}
                      border="1px solid"
                      borderColor={
                        isComplete
                          ? 'green.200'
                          : isActive
                            ? forgotPasswordFlow.role === 'banker'
                              ? 'orange.200'
                              : 'teal.200'
                            : 'blackAlpha.100'
                      }
                      boxShadow={isActive ? '0 10px 24px rgba(15, 23, 42, 0.06)' : 'none'}
                    >
                      <Circle
                        size="44px"
                        bg={
                          isComplete
                            ? 'green.100'
                            : isActive
                              ? forgotPasswordFlow.role === 'banker'
                                ? 'orange.100'
                                : 'teal.100'
                              : 'whiteAlpha.800'
                        }
                        color={
                          isComplete ? 'green.600' : forgotPasswordFlow.role === 'banker' ? 'orange.500' : 'teal.500'
                        }
                        flexShrink={0}
                      >
                        <Icon as={isComplete ? FiCheckCircle : stepCard.icon} boxSize={5} />
                      </Circle>
                      <Box>
                        <Text fontWeight="700" color="gray.800">
                          {stepCard.title}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {stepCard.description}
                        </Text>
                      </Box>
                    </HStack>
                  )
                })}
              </Stack>

              <Divider borderColor="blackAlpha.100" />

              {forgotPasswordFlow.message.text ? (
                <Alert
                  status={forgotPasswordFlow.message.type === 'success' ? 'success' : 'error'}
                  borderRadius="xl"
                  bg={forgotPasswordFlow.message.type === 'success' ? 'whiteAlpha.900' : 'red.50'}
                >
                  <AlertIcon />
                  {forgotPasswordFlow.message.text}
                </Alert>
              ) : null}

              {!forgotPasswordFlow.step ? (
                <Box
                  borderRadius="18px"
                  p={5}
                  bg="rgba(255,255,255,0.78)"
                  border="1px dashed"
                  borderColor={forgotPasswordFlow.role === 'banker' ? 'orange.200' : 'teal.200'}
                >
                  <Stack spacing={2}>
                    <HStack spacing={3}>
                      <Circle size="40px" bg={forgotPasswordFlow.role === 'banker' ? 'orange.100' : 'teal.100'}>
                        <Icon as={FiRefreshCw} color={forgotPasswordFlow.role === 'banker' ? 'orange.500' : 'teal.500'} />
                      </Circle>
                      <Text fontWeight="600">Reset links feel clunky. This flow keeps everything on one screen.</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Enter your email in the login form, tap <Text as="span" fontWeight="600">Forgot password?</Text>,
                      and we’ll open the next step here.
                    </Text>
                  </Stack>
                </Box>
              ) : forgotPasswordFlow.step === 'otp' ? (
                <Box
                  as="form"
                  onSubmit={forgotPasswordOtpForm.handleSubmit(handleVerifyForgotPasswordOtp)}
                  bg="rgba(255,255,255,0.82)"
                  borderRadius="20px"
                  p={5}
                  border="1px solid"
                  borderColor="whiteAlpha.800"
                >
                  <Stack spacing={4}>
                    <FormControl isRequired isInvalid={Boolean(forgotPasswordOtpForm.formState.errors.otp)}>
                      <FormLabel>Verification code</FormLabel>
                      <Input
                        size="lg"
                        placeholder="Enter 6-digit code"
                        bg="white"
                        borderColor="transparent"
                        _hover={{ borderColor: forgotPasswordFlow.role === 'banker' ? 'orange.200' : 'teal.200' }}
                        _focusVisible={{
                          borderColor: forgotPasswordFlow.role === 'banker' ? 'orange.400' : 'teal.400',
                          boxShadow:
                            forgotPasswordFlow.role === 'banker' ? '0 0 0 1px #f6ad55' : '0 0 0 1px #319795',
                        }}
                        {...forgotPasswordOtpForm.register('otp')}
                      />
                      <FormErrorMessage>{forgotPasswordOtpForm.formState.errors.otp?.message}</FormErrorMessage>
                    </FormControl>
                    <Button
                      colorScheme={forgotPasswordFlow.role === 'banker' ? 'orange' : 'teal'}
                      type="submit"
                      size="lg"
                      isLoading={forgotPasswordOtpForm.formState.isSubmitting}
                    >
                      Verify code
                    </Button>
                    <HStack spacing={3} flexWrap="wrap">
                      <Button
                        variant="outline"
                        colorScheme={forgotPasswordFlow.role === 'banker' ? 'orange' : 'teal'}
                        onClick={handleResendForgotPasswordOtp}
                        isLoading={forgotPasswordFlow.isResendingOtp}
                        leftIcon={<FiRefreshCw />}
                      >
                        Resend code
                      </Button>
                      <Button variant="ghost" onClick={closeForgotPasswordFlow}>
                        Cancel
                      </Button>
                    </HStack>
                  </Stack>
                </Box>
              ) : (
                <Box
                  as="form"
                  onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)}
                  bg="rgba(255,255,255,0.82)"
                  borderRadius="20px"
                  p={5}
                  border="1px solid"
                  borderColor="whiteAlpha.800"
                >
                  <Stack spacing={4}>
                    <FormControl isRequired isInvalid={Boolean(resetPasswordForm.formState.errors.newPassword)}>
                      <FormLabel>New password</FormLabel>
                      <Input
                        type="password"
                        size="lg"
                        placeholder="Enter your new password"
                        bg="white"
                        borderColor="transparent"
                        _hover={{ borderColor: forgotPasswordFlow.role === 'banker' ? 'orange.200' : 'teal.200' }}
                        _focusVisible={{
                          borderColor: forgotPasswordFlow.role === 'banker' ? 'orange.400' : 'teal.400',
                          boxShadow:
                            forgotPasswordFlow.role === 'banker' ? '0 0 0 1px #f6ad55' : '0 0 0 1px #319795',
                        }}
                        {...resetPasswordForm.register('newPassword')}
                      />
                      <FormErrorMessage>{resetPasswordForm.formState.errors.newPassword?.message}</FormErrorMessage>
                    </FormControl>
                    <Button
                      colorScheme={forgotPasswordFlow.role === 'banker' ? 'orange' : 'teal'}
                      type="submit"
                      size="lg"
                      isLoading={resetPasswordForm.formState.isSubmitting}
                    >
                      Save new password
                    </Button>
                    <Button variant="ghost" onClick={closeForgotPasswordFlow}>
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        </SimpleGrid>
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
            <Button as={RouterLink} to="/register/individual" variant="link" colorScheme="teal">
              Sign up as individual
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
