import Button from '@app/components/Common/Button';
import LoadingSpinner from '@app/components/Common/LoadingSpinner';
import PageTitle from '@app/components/Common/PageTitle';
import { useUser } from '@app/hooks/useUser';
import defineMessages from '@app/utils/defineMessages';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

const messages = defineMessages('pages.Activate', {
  title: 'Activate Device',
  heading: 'Activate a Jellyfin device',
  description:
    'Enter the Quick Connect code shown on your Jellyfin device to authorize it with your account.',
  codeLabel: 'Quick Connect Code',
  codePlaceholder: 'Enter code',
  authorize: 'Authorize Device',
  authorizing: 'Authorizing…',
  successTitle: 'Device authorized',
  successMessage:
    'Return to your Jellyfin device. It should finish signing in shortly.',
  errorTitle: 'Activation failed',
});

const ActivatePage: NextPage = () => {
  const intl = useIntl();
  const router = useRouter();
  const { user } = useUser();

  const queryCode = useMemo(() => {
    const rawCode = router.query.code;

    return typeof rawCode === 'string' ? rawCode : '';
  }, [router.query.code]);

  const [code, setCode] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (queryCode) {
      setCode(queryCode);
    }
  }, [queryCode]);

  useEffect(() => {
    if (user === null && router.isReady) {
      router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
    }
  }, [router, user]);

  const handleAuthorize = async () => {
    const normalizedCode = code.trim();

    if (!normalizedCode) {
      return;
    }

    setIsAuthorizing(true);
    setAuthorized(false);
    setErrorMessage(null);

    try {
      const response = await axios.post(
        '/api/v1/auth/jellyfin/quickconnect/authorize',
        { code: normalizedCode }
      );

      if (response.data.authorized) {
        setAuthorized(true);
      } else {
        setErrorMessage(intl.formatMessage(messages.errorTitle));
      }
    } catch (e) {
      setErrorMessage(
        e.response?.data?.message || intl.formatMessage(messages.errorTitle)
      );
    } finally {
      setIsAuthorizing(false);
    }
  };

  if (user === undefined) {
    return (
      <>
        <PageTitle title={intl.formatMessage(messages.title)} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (user === null) {
    return (
      <>
        <PageTitle title={intl.formatMessage(messages.title)} />
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title={intl.formatMessage(messages.title)} />

      <div className="mx-auto max-w-xl">
        <div className="rounded-lg bg-gray-800 p-6 shadow">
          <h1 className="mb-2 text-2xl font-bold text-white">
            {intl.formatMessage(messages.heading)}
          </h1>
          <p className="mb-6 text-gray-300">
            {intl.formatMessage(messages.description)}
          </p>
          <label
            htmlFor="quick-connect-code"
            className="mb-2 block text-sm font-medium text-gray-200"
          >
            {intl.formatMessage(messages.codeLabel)}
          </label>
          <input
            id="quick-connect-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={intl.formatMessage(messages.codePlaceholder)}
            className="mb-4 w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-3 text-lg font-semibold uppercase tracking-wider text-white placeholder:text-gray-400"
            disabled={isAuthorizing || authorized}
          />

          <Button
            buttonType="primary"
            type="button"
            disabled={isAuthorizing || authorized || !code.trim()}
            onClick={handleAuthorize}
            className="w-full"
          >
            {isAuthorizing && <LoadingSpinner />}
            <span>
              {isAuthorizing
                ? intl.formatMessage(messages.authorizing)
                : intl.formatMessage(messages.authorize)}
            </span>
          </Button>

          {authorized && (
            <div className="mt-6 flex items-start rounded-md bg-green-600/20 p-4 text-green-200">
              <CheckCircleIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">
                  {intl.formatMessage(messages.successTitle)}
                </div>
                <div>{intl.formatMessage(messages.successMessage)}</div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-6 flex items-start rounded-md bg-red-600/20 p-4 text-red-200">
              <XCircleIcon className="mr-3 h-6 w-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">
                  {intl.formatMessage(messages.errorTitle)}
                </div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivatePage;
