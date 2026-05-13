import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiBriefcase, FiLock, FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'
import apiClient from '../api/apiClient.js'
import { API_ENDPOINTS } from '../api/endpoints.js'

const initializeSignupSchema = yup
  .object({
    email: yup.string().trim().email('Please enter a valid email').required('Please enter email'),
  })
  .required()

const verifyOtpSchema = yup
  .object({
    otp: yup
      .string()
      .transform((_, originalValue) => String(originalValue ?? '').replace(/\D/g, ''))
      .required('Please enter the OTP')
      .matches(/^\d{6}$/, 'OTP should be 6 digits'),
  })
  .required()

const commonRegistrationFields = {
  fullname: yup.string().trim().required('Please enter full name'),
  password: yup.string().required('Please enter password').min(6, 'Password should be at least 6 characters'),
  phoneNumber: yup
    .string()
    .transform((_, originalValue) => String(originalValue ?? '').replace(/\D/g, ''))
    .required('Please enter phone number')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
}

const bankerRegistrationSchema = yup
  .object({
    ...commonRegistrationFields,
    institutionName: yup.string().trim().required('Please enter institution name'),
    designation: yup.string().trim().required('Please select designation'),
  })
  .required()

const customerRegistrationSchema = yup
  .object({
    ...commonRegistrationFields,
    relationshipToProperty: yup
      .string()
      .required('Please select relationship to property')
      .oneOf(['Owner', 'Buyer', 'Broker', 'Agent'], 'Please choose a valid relationship'),
    preferredContact: yup
      .string()
      .required('Please select preferred contact method')
      .oneOf(['Email', 'Phone', 'SMS'], 'Please choose a valid contact method'),
    city: yup.string().trim().required('Please enter city'),
    state: yup.string().trim().required('Please enter state'),
  })
  .required()

const registrationDefaultValuesByRole = {
  banker: {
    fullname: '',
    password: '',
    phoneNumber: '',
    institutionName: '',
    designation: '',
  },
  client: {
    fullname: '',
    password: '',
    phoneNumber: '',
    relationshipToProperty: '',
    preferredContact: '',
    city: '',
    state: '',
  },
}

const registrationSchemaByRole = {
  banker: bankerRegistrationSchema,
  client: customerRegistrationSchema,
}

const registrationButtonLabelByRole = {
  banker: 'Create banker account',
  client: 'Create customer account',
}

const formatApiMessage = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.response?.data?.error || fallbackMessage

function RegistrationFlow({
  roleValue,
  roleLabel,
  accentColor,
  badgeText,
  heading,
  description,
}) {
  const [currentStep, setCurrentStep] = useState('initialize')
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' })

  const registrationDefaultValues = registrationDefaultValuesByRole[roleValue]
  const registrationSchema = registrationSchemaByRole[roleValue]
  const isBanker = roleValue === 'banker'

  const initializeForm = useForm({
    resolver: yupResolver(initializeSignupSchema),
    defaultValues: {
      email: '',
    },
  })

  const otpForm = useForm({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      otp: '',
    },
  })

  const registrationForm = useForm({
    resolver: yupResolver(registrationSchema),
    defaultValues: registrationDefaultValues,
  })

  const stepCards = useMemo(
    () => [
      {
        id: 'initialize',
        title: '1. Verify email',
        description: 'Request a one-time password.',
      },
      {
        id: 'verify',
        title: '2. Enter OTP',
        description: 'Confirm the code sent to your inbox.',
      },
      {
        id: 'details',
        title: '3. Finish profile',
        description: `Complete your ${roleLabel.toLowerCase()} account details.`,
      },
    ],
    [roleLabel],
  )

  const getStepState = (stepId) => {
    if (currentStep === 'done') {
      return 'complete'
    }

    const order = ['initialize', 'verify', 'details']
    const currentIndex = order.indexOf(currentStep)
    const stepIndex = order.indexOf(stepId)

    if (stepIndex < currentIndex) {
      return 'complete'
    }

    if (stepIndex === currentIndex) {
      return 'active'
    }

    return 'upcoming'
  }

  const resetFlow = (nextEmail = '') => {
    setCurrentStep('initialize')
    setVerifiedEmail('')
    setSubmitMessage({ type: '', text: '' })
    initializeForm.reset({ email: nextEmail })
    otpForm.reset({ otp: '' })
    registrationForm.reset(registrationDefaultValues)
  }

  const handleInitializeSignup = async ({ email }) => {
    setSubmitMessage({ type: '', text: '' })

    const normalizedEmail = email.trim()

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.initializeSignup, {
        email: normalizedEmail,
        role: roleValue,
      })

      const apiResponse = response?.data ?? {}
      setVerifiedEmail(normalizedEmail)
      setCurrentStep('verify')
      initializeForm.reset({ email: normalizedEmail })
      otpForm.reset({ otp: '' })
      setSubmitMessage({
        type: 'success',
        text: apiResponse.message || `OTP sent to ${normalizedEmail}. Enter it below to continue.`,
      })
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: formatApiMessage(error, 'Unable to send OTP right now. Please try again.'),
      })
    }
  }

  const handleVerifyOtp = async ({ otp }) => {
    setSubmitMessage({ type: '', text: '' })

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.verifySignup, {
        otp: Number(otp),
      })

      const apiResponse = response?.data ?? {}
      setCurrentStep('details')
      registrationForm.reset(registrationDefaultValues)
      setSubmitMessage({
        type: 'success',
        text: apiResponse.message || 'OTP verified. Complete the remaining details to create your account.',
      })
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: formatApiMessage(error, 'OTP verification failed. Please check the code and try again.'),
      })
    }
  }

  const handleCompleteSignup = async (values) => {
    setSubmitMessage({ type: '', text: '' })

    const payload = {
      fullname: values.fullname.trim(),
      password: values.password,
      role: roleValue,
      phoneNumber: values.phoneNumber,
      email: verifiedEmail,
    }

    if (isBanker) {
      payload.institutionName = values.institutionName.trim()
      payload.designation = values.designation.trim()
    } else {
      payload.relationshipToProperty = values.relationshipToProperty
      payload.preferredContact = values.preferredContact
      payload.city = values.city.trim()
      payload.state = values.state.trim()
    }

    try {
      const response = await apiClient.post(API_ENDPOINTS.auth.register, payload)
      const apiResponse = response?.data ?? {}

      setCurrentStep('done')
      initializeForm.reset({ email: '' })
      otpForm.reset({ otp: '' })
      registrationForm.reset(registrationDefaultValues)
      setSubmitMessage({
        type: 'success',
        text: apiResponse.message || 'Account created successfully. You can log in now.',
      })
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: formatApiMessage(error, 'Unable to create your account right now. Please try again.'),
      })
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme={accentColor} variant="subtle" w="fit-content">
          {badgeText}
        </Badge>
        <Heading>{heading}</Heading>
        <Text color="gray.700">{description}</Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <Stack spacing={6}>
          {submitMessage.text ? (
            <Alert status={submitMessage.type === 'success' ? 'success' : 'error'} borderRadius="md">
              <AlertIcon />
              {submitMessage.text}
            </Alert>
          ) : null}

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {stepCards.map((step) => {
              const stepState = getStepState(step.id)
              const isActive = stepState === 'active'
              const isComplete = stepState === 'complete'

              return (
                <Box
                  key={step.id}
                  borderRadius="18px"
                  border="1px solid"
                  borderColor={isActive || isComplete ? `${accentColor}.300` : 'blackAlpha.200'}
                  bg={isActive ? `${accentColor}.50` : 'white'}
                  px={4}
                  py={4}
                >
                  <Text fontWeight="700" color={isComplete ? `${accentColor}.600` : 'gray.800'}>
                    {step.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {step.description}
                  </Text>
                </Box>
              )
            })}
          </SimpleGrid>

          {verifiedEmail ? (
            <Box
              borderRadius="18px"
              bg={`${accentColor}.50`}
              border="1px solid"
              borderColor={`${accentColor}.200`}
              px={4}
              py={4}
            >
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={3}
                align={{ base: 'flex-start', md: 'center' }}
                justify="space-between"
              >
                <Box>
                  <Text fontWeight="600">Verified email in progress</Text>
                  <Text color="gray.700">{verifiedEmail}</Text>
                </Box>
                {currentStep !== 'done' ? (
                  <Button
                    variant="outline"
                    colorScheme={accentColor}
                    size="sm"
                    onClick={() => resetFlow(verifiedEmail)}
                  >
                    Change email
                  </Button>
                ) : null}
              </Stack>
            </Box>
          ) : null}

          {currentStep === 'initialize' ? (
            <Box as="form" onSubmit={initializeForm.handleSubmit(handleInitializeSignup)}>
              <Stack spacing={5}>
                <FormControl isRequired isInvalid={Boolean(initializeForm.formState.errors.email)}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FiMail color="#94a3b8" />
                    </InputLeftElement>
                    <Input
                      type="email"
                      placeholder={isBanker ? 'name@bank.com' : 'name@email.com'}
                      {...initializeForm.register('email')}
                    />
                  </InputGroup>
                  <FormHelperText>
                    We will send a one-time password to this email before account creation.
                  </FormHelperText>
                  <FormErrorMessage>{initializeForm.formState.errors.email?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  colorScheme={accentColor}
                  size="lg"
                  type="submit"
                  isLoading={initializeForm.formState.isSubmitting}
                >
                  Send OTP
                </Button>
              </Stack>
            </Box>
          ) : null}

          {currentStep === 'verify' ? (
            <Box as="form" onSubmit={otpForm.handleSubmit(handleVerifyOtp)}>
              <Stack spacing={5}>
                <FormControl isRequired isInvalid={Boolean(otpForm.formState.errors.otp)}>
                  <FormLabel>OTP</FormLabel>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    {...otpForm.register('otp')}
                  />
                  <FormHelperText>
                    Enter the 6-digit code sent to {verifiedEmail}.
                  </FormHelperText>
                  <FormErrorMessage>{otpForm.formState.errors.otp?.message}</FormErrorMessage>
                </FormControl>

                <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                  <Button
                    colorScheme={accentColor}
                    size="lg"
                    type="submit"
                    isLoading={otpForm.formState.isSubmitting}
                  >
                    Verify OTP
                  </Button>
                  <Button
                    variant="outline"
                    colorScheme={accentColor}
                    onClick={() => resetFlow(verifiedEmail)}
                  >
                    Back
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ) : null}

          {currentStep === 'details' ? (
            <Box as="form" onSubmit={registrationForm.handleSubmit(handleCompleteSignup)}>
              <Stack spacing={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.fullname)}>
                    <FormLabel>Full name</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiUser color="#94a3b8" />
                      </InputLeftElement>
                      <Input placeholder="Enter full name" {...registrationForm.register('fullname')} />
                    </InputGroup>
                    <FormErrorMessage>{registrationForm.formState.errors.fullname?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Verified email</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiShield color="#94a3b8" />
                      </InputLeftElement>
                      <Input value={verifiedEmail} isReadOnly />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.phoneNumber)}>
                    <FormLabel>Phone number</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiPhone color="#94a3b8" />
                      </InputLeftElement>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="9876543210"
                        {...registrationForm.register('phoneNumber')}
                      />
                    </InputGroup>
                    <FormErrorMessage>{registrationForm.formState.errors.phoneNumber?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.password)}>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <FiLock color="#94a3b8" />
                      </InputLeftElement>
                      <Input type="password" placeholder="Create password" {...registrationForm.register('password')} />
                    </InputGroup>
                    <FormErrorMessage>{registrationForm.formState.errors.password?.message}</FormErrorMessage>
                  </FormControl>

                  {isBanker ? (
                    <>
                      <FormControl
                        isRequired
                        isInvalid={Boolean(registrationForm.formState.errors.institutionName)}
                      >
                        <FormLabel>Institution name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <FiBriefcase color="#94a3b8" />
                          </InputLeftElement>
                          <Input
                            placeholder="Bank or financial institution"
                            {...registrationForm.register('institutionName')}
                          />
                        </InputGroup>
                        <FormErrorMessage>
                          {registrationForm.formState.errors.institutionName?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.designation)}>
                        <FormLabel>Designation</FormLabel>
                        <Select placeholder="Choose designation" {...registrationForm.register('designation')}>
                          <option value="Loan Officer">Loan Officer</option>
                          <option value="Credit Analyst">Credit Analyst</option>
                          <option value="Branch Manager">Branch Manager</option>
                          <option value="Relationship Manager">Relationship Manager</option>
                        </Select>
                        <FormErrorMessage>{registrationForm.formState.errors.designation?.message}</FormErrorMessage>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <FormControl
                        isRequired
                        isInvalid={Boolean(registrationForm.formState.errors.relationshipToProperty)}
                      >
                        <FormLabel>Relationship to property</FormLabel>
                        <Select
                          placeholder="Choose relationship"
                          {...registrationForm.register('relationshipToProperty')}
                        >
                          <option value="Owner">Owner</option>
                          <option value="Buyer">Buyer</option>
                          <option value="Broker">Broker</option>
                          <option value="Agent">Agent</option>
                        </Select>
                        <FormErrorMessage>
                          {registrationForm.formState.errors.relationshipToProperty?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isRequired
                        isInvalid={Boolean(registrationForm.formState.errors.preferredContact)}
                      >
                        <FormLabel>Preferred contact</FormLabel>
                        <Select placeholder="Choose contact method" {...registrationForm.register('preferredContact')}>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="SMS">SMS</option>
                        </Select>
                        <FormErrorMessage>
                          {registrationForm.formState.errors.preferredContact?.message}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.city)}>
                        <FormLabel>City</FormLabel>
                        <Input placeholder="Enter city" {...registrationForm.register('city')} />
                        <FormErrorMessage>{registrationForm.formState.errors.city?.message}</FormErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={Boolean(registrationForm.formState.errors.state)}>
                        <FormLabel>State</FormLabel>
                        <Input placeholder="Enter state" {...registrationForm.register('state')} />
                        <FormErrorMessage>{registrationForm.formState.errors.state?.message}</FormErrorMessage>
                      </FormControl>
                    </>
                  )}
                </SimpleGrid>

                <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                  <Button
                    colorScheme={accentColor}
                    size="lg"
                    type="submit"
                    isLoading={registrationForm.formState.isSubmitting}
                  >
                    {registrationButtonLabelByRole[roleValue]}
                  </Button>
                  <Button variant="outline" colorScheme={accentColor} onClick={() => setCurrentStep('verify')}>
                    Back
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ) : null}

          {currentStep === 'done' ? (
            <Stack spacing={4}>
              <Text color="gray.700">
                Your {roleLabel.toLowerCase()} account has been created. Continue to login or start another
                registration.
              </Text>
              <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
                <Button as={RouterLink} to="/login" colorScheme={accentColor} size="lg">
                  Go to login
                </Button>
                <Button variant="outline" colorScheme={accentColor} size="lg" onClick={() => resetFlow()}>
                  Register another account
                </Button>
              </Stack>
            </Stack>
          ) : null}

          <Button as={RouterLink} to="/login" variant="link" colorScheme={accentColor} alignSelf="flex-start">
            Already registered? Log in
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default RegistrationFlow
