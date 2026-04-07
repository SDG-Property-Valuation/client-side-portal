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
import { FiFileText, FiLock, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { Link as RouterLink } from 'react-router-dom'
import * as yup from 'yup'

const registerClientSchema = yup
  .object({
    fullname: yup.string().trim().required('Please enter full name'),
    phoneNumber: yup
      .string()
      .transform((_, originalValue) => String(originalValue ?? '').replace(/\D/g, ''))
      .required('Please enter phone number')
      .matches(/^\d{10,15}$/, 'Phone number should be 10 to 15 digits'),
    email: yup.string().trim().email('Please enter a valid email').required('Please enter email'),
    password: yup.string().required('Please enter password').min(8, 'Password should be at least 8 characters'),
    relationshipToProperty: yup.string().required('Please select relation to property'),
    preferredContact: yup.string().required('Please select preferred contact method'),
    city: yup.string().required('Please select city'),
    state: yup.string().trim().required('Please enter state'),
    propertyRegistryNumber: yup.string().trim(),
    confirmation: yup
      .boolean()
      .oneOf([true], 'Please confirm this information before submitting'),
  })
  .required()

const defaultValues = {
  fullname: '',
  phoneNumber: '',
  email: '',
  password: '',
  relationshipToProperty: '',
  preferredContact: '',
  city: '',
  state: '',
  propertyRegistryNumber: '',
  confirmation: false,
}

function PersonalRegister() {
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(registerClientSchema),
    defaultValues,
  })

  const onSubmit = async (values) => {
    setSubmitMessage({ type: '', text: '' })

    const payload = {
      fullname: values.fullname.trim(),
      phoneNumber: Number(values.phoneNumber),
      email: values.email.trim(),
      password: values.password,
      relationshipToProperty: values.relationshipToProperty,
      preferredContact: values.preferredContact,
      city: values.city,
      state: values.state.trim(),
      propertyRegistryNumber: values.propertyRegistryNumber.trim(),
    }

    try {
      await apiClient.post(API_ENDPOINTS.client.register, payload)
      setSubmitMessage({
        type: 'success',
        text: 'Signup submitted successfully.',
      })
      reset(defaultValues)
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to submit signup right now. Please try again.'

      setSubmitMessage({ type: 'error', text: apiMessage })
    }
  }

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          Individual signup
        </Badge>
        <Heading>Sign up as individual user</Heading>
        <Text color="gray.700">
          Enter your details to create your account.
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
          <Alert status={submitMessage.type === 'success' ? 'success' : 'error'} borderRadius="md" mb={6}>
            <AlertIcon />
            {submitMessage.text}
          </Alert>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired isInvalid={Boolean(errors.fullname)}>
            <FormLabel>Full name</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder="Enter full name" {...register('fullname')} />
            </InputGroup>
            <FormErrorMessage>{errors.fullname?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.email)}>
            <FormLabel>Email</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="#94a3b8" />
              </InputLeftElement>
              <Input type="email" placeholder="name@email.com" {...register('email')} />
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

          <FormControl isRequired isInvalid={Boolean(errors.relationshipToProperty)}>
            <FormLabel>Relation to property</FormLabel>
            <Select placeholder="Choose relation" {...register('relationshipToProperty')}>
              <option value="Owner">Owner</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Legal Heir">Legal heir</option>
            </Select>
            <FormErrorMessage>{errors.relationshipToProperty?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.preferredContact)}>
            <FormLabel>Preferred contact method</FormLabel>
            <Select placeholder="Choose contact method" {...register('preferredContact')}>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="WhatsApp">WhatsApp</option>
            </Select>
            <FormErrorMessage>{errors.preferredContact?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.city)}>
            <FormLabel>City</FormLabel>
            <Select placeholder="Select city" {...register('city')}>
              <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
              <option value="Sillod">Sillod</option>
              <option value="Pune">Pune</option>
            </Select>
            <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(errors.state)}>
            <FormLabel>State</FormLabel>
            <Input placeholder="Maharashtra" {...register('state')} />
            <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={Boolean(errors.propertyRegistryNumber)}>
            <FormLabel>Property registry number</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiFileText color="#94a3b8" />
              </InputLeftElement>
              <Input
                placeholder="Optional registry number"
                {...register('propertyRegistryNumber')}
              />
            </InputGroup>
            <FormErrorMessage>{errors.propertyRegistryNumber?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>

        <Stack spacing={4} mt={6}>
          <FormControl isRequired isInvalid={Boolean(errors.confirmation)}>
            <Controller
              name="confirmation"
              control={control}
              render={({ field }) => (
                <Checkbox
                  colorScheme="teal"
                  isChecked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                >
                  I confirm this information is correct.
                </Checkbox>
              )}
            />
            <FormErrorMessage>{errors.confirmation?.message}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="teal" size="lg" type="submit" isLoading={isSubmitting}>
            Submit signup
          </Button>

          <Button as={RouterLink} to="/login" variant="link" colorScheme="teal">
            Already registered? Log in
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default PersonalRegister
