import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
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
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiFileText, FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi'
import { useI18n } from '../i18n/LanguageProvider.jsx'

function PersonalRegister() {
  const { t } = useI18n()

  return (
    <Stack spacing={8}>
      <Stack spacing={3}>
        <Badge colorScheme="teal" variant="subtle" w="fit-content">
          {t('personal.badge')}
        </Badge>
        <Heading>{t('personal.heading')}</Heading>
        <Text color="gray.700">
          {t('personal.subheading')}
        </Text>
      </Stack>

      <Box
        bg="whiteAlpha.900"
        borderRadius="24px"
        p={{ base: 6, md: 8 }}
        boxShadow="0 20px 50px rgba(18, 54, 53, 0.14)"
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isRequired>
            <FormLabel>{t('form.label.fullName')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiUser color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('form.placeholder.fullName')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('form.label.email')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMail color="#94a3b8" />
              </InputLeftElement>
              <Input type="email" placeholder={t('form.placeholder.email')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('form.label.phone')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiPhone color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('form.placeholder.phone')} />
            </InputGroup>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('form.label.relationship')}</FormLabel>
            <Select placeholder={t('form.placeholder.relationship')}>
              <option value="owner">{t('form.option.relationship.owner')}</option>
              <option value="buyer">{t('form.option.relationship.buyer')}</option>
              <option value="broker">{t('form.option.relationship.broker')}</option>
              <option value="agent">{t('form.option.relationship.agent')}</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('form.label.preferredContact')}</FormLabel>
            <Select placeholder={t('form.placeholder.preferredContact')}>
              <option value="email">{t('form.option.contact.email')}</option>
              <option value="phone">{t('form.option.contact.phone')}</option>
              <option value="sms">{t('form.option.contact.sms')}</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>{t('form.label.cityState')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMapPin color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('form.placeholder.cityState')} />
            </InputGroup>
          </FormControl>
          <FormControl>
            <FormLabel>{t('form.label.propertyType')}</FormLabel>
            <Select placeholder={t('form.placeholder.propertyType')}>
              <option value="residential">{t('form.option.propertyType.residential')}</option>
              <option value="commercial">{t('form.option.propertyType.commercial')}</option>
              <option value="land">{t('form.option.propertyType.land')}</option>
              <option value="industrial">{t('form.option.propertyType.industrial')}</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>{t('form.label.registryNumber')}</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiFileText color="#94a3b8" />
              </InputLeftElement>
              <Input placeholder={t('form.placeholder.registryNumber')} />
            </InputGroup>
          </FormControl>
        </SimpleGrid>

        <FormControl mt={6}>
          <FormLabel>{t('form.label.notes')}</FormLabel>
          <Textarea placeholder={t('form.placeholder.notes')} />
        </FormControl>

        <Stack spacing={4} mt={6}>
          <Checkbox colorScheme="teal">
            {t('personal.confirmation')}
          </Checkbox>
          <Button colorScheme="teal" size="lg">
            {t('personal.submit')}
          </Button>
          <Button as={RouterLink} to="/login" variant="link" colorScheme="teal">
            {t('personal.loginLink')}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default PersonalRegister
