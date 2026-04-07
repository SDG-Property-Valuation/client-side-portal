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
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import apiClient from '../api/apiClient.js'
import { API_ENDPOINTS } from '../api/endpoints.js'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FiBriefcase, FiLock, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'

const registerBankSchema = yup
  .object({
    institutionName: yup.string().trim().required('Please enter bank name'),
    branch: yup.string().trim().required('Please enter branch'),
    bankEmployeeName: yup.string().trim().required('Please enter employee name'),
    designation: yup.string().required('Please select designation'),
    phoneNumber: yup
      .string()
      .transform((_, originalValue) => String(originalValue ?? '').replace(/\D/g, ''))
      .required('Please enter phone number')
      .matches(/^\d{10,15}$/, 'Phone number should be 10 to 15 digits'),
    email: yup.string().trim().email('Please enter a valid email').required('Please enter email'),
    password: yup
      .string()
      .required('Please enter password')
      .min(8, 'Password should be at least 8 characters'),
    confirmation: yup
      .boolean()
      .oneOf([true], 'Please confirm this information before submitting'),
  })
  .required()

const defaultValues = {
  institutionName: '',
  branch: '',
  bankEmployeeName: '',
  designation: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmation: false,
}

function BankRegister() {
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerBankSchema),
    defaultValues,
  })

  const onSubmit = async (values) => {
    setSubmitMessage({ type: '', text: '' })

    const payload = {
      institutionName: values.institutionName.trim(),
      branch: values.branch.trim(),
      bankEmployeeName: values.bankEmployeeName.trim(),
      designation: values.designation,
      phoneNumber: Number(values.phoneNumber),
      email: values.email.trim(),
      password: values.password,
    }

    try {
      await apiClient.post(API_ENDPOINTS.bank.register, payload)
      setSubmitMessage({ type: 'success', text: 'Bank signup submitted successfully.' })
      reset(defaultValues)
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to submit bank signup right now. Please try again.'

      setSubmitMessage({ type: 'error', text: apiMessage })
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="orange" variant="subtle" w="fit-content">
          Bank signup
        </Badge>
        <Heading>Sign up as bank user</Heading>
        <Text color="gray.700">
          Use this portal to submit bank valuation cases and required documents.
        </Text>
      </Stack>

      <Box
        as="form"
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
        onSubmit={handleSubmit(onSubmit)}
      >
        {submitMessage.text ? (
          <Alert
            status={submitMessage.type === 'success' ? 'success' : 'error'}
            borderRadius="md"
            mb={6}
          >
            <AlertIcon />
            {submitMessage.text}
          </Alert>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={Boolean(errors.institutionName)}>
            <FormLabel>Institution name</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiBriefcase color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder="Bank or financial institution" {...register('institutionName')} />
            </InputGroup>
            <FormErrorMessage>{errors.institutionName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.branch)}>
            <FormLabel>Branch</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMapPin color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder="Pune Main Branch" {...register('branch')} />
            </InputGroup>
            <FormErrorMessage>{errors.branch?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.bankEmployeeName)}>
            <FormLabel>Bank employee name</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder="Enter employee full name" {...register('bankEmployeeName')} />
            </InputGroup>
            <FormErrorMessage>{errors.bankEmployeeName?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.designation)}>
            <FormLabel>Designation</FormLabel>
            <Select placeholder="Choose designation" {...register('designation')}>
              <option value="Loan Officer">Loan Officer</option>
              <option value="Credit Analyst">Credit Analyst</option>
              <option value="Branch Manager">Branch Manager</option>
              <option value="Relationship Manager">Relationship Manager</option>
            </Select>
            <FormErrorMessage>{errors.designation?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.email)}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="#94a3b8" />
              </InputLeftElement>
              <Input type="email" placeholder="name@bank.com" {...register('email')} />
            </InputGroup>
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.phoneNumber)}>
            <FormLabel>Phone</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiPhone color="#94a3b8" />
              </InputLeftElement>
              <Input type="tel" inputMode="numeric" placeholder="9876543210" {...register('phoneNumber')} />
            </InputGroup>
            <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={Boolean(errors.password)}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiLock color="#94a3b8" />
              </InputLeftElement>
              <Input type="password" placeholder="Enter password" {...register('password')} />
            </InputGroup>
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          {/* <FormControl>
            <FormLabel>Bank registration ID</FormLabel>
            <Input placeholder="Optional licensing or registration ID" />
          </FormControl> */}
          {/* <FormControl>
            <FormLabel>Estimated monthly requests</FormLabel>
            <Input placeholder="Select volume" />
          </FormControl> */}
        </SimpleGrid>

        <Stack spacing={4} mt={6}>
          <FormControl isRequired isInvalid={Boolean(errors.confirmation)}>
            <Controller
              name="confirmation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  colorScheme="orange"
                  isChecked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                >
                  I confirm I am allowed to submit these bank case details and documents.
                </Checkbox>
              )}
            />
            <FormErrorMessage>{errors.confirmation?.message}</FormErrorMessage>
          </FormControl>
          <Button colorScheme="orange" size="lg" type="submit" isLoading={isSubmitting}>
            Submit bank signup
          </Button>
          <Button as={RouterLink} to="/login" variant="link" colorScheme="orange">
            Already registered? Log in
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default BankRegister
