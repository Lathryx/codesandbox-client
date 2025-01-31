import React from 'react';
import {
  Stack,
  Text,
  Icon,
  IconButton,
  Avatar,
  Button,
} from '@codesandbox/components';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import css from '@styled-system/css';
import { AnonymousAvatar } from './AnonymousAvatar';
import { CommunitySandboxItemComponentProps } from './types';

type SandboxTitleProps = {
  stoppedScrolling: boolean;
} & Pick<CommunitySandboxItemComponentProps, 'title' | 'onContextMenu'>;

const SandboxTitle: React.FC<SandboxTitleProps> = React.memo(
  ({ title, onContextMenu, stoppedScrolling }) => (
    <Stack justify="space-between" align="center" marginLeft={4}>
      <Text size={3} weight="medium">
        {title}
      </Text>

      {!stoppedScrolling ? (
        // During scrolling we don't show the button, because it takes 1ms to render a button,
        // while this doesn't sound like a lot, we need to render 4 new grid items when you scroll down,
        // and this can't take more than 12ms. Showing another thing than the button shaves off a 4ms of
        // render time and allows you to scroll with a minimum of 30fps.
        <div
          style={{
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          css={css({ color: 'mutedForeground' })}
        >
          <Icon size={9} name="more" />
        </div>
      ) : (
        <IconButton
          name="more"
          size={9}
          title="Sandbox Actions"
          onClick={onContextMenu}
        />
      )}
    </Stack>
  )
);

type StatsProps = Pick<
  CommunitySandboxItemComponentProps,
  'forkCount' | 'likeCount' | 'liked' | 'onLikeToggle'
>;
export const Stats: React.FC<StatsProps> = ({
  forkCount,
  likeCount,
  liked,
  onLikeToggle,
}) => (
  <Stack as={Text} variant="muted" align="center" gap={2}>
    <Stack align="center" gap={1}>
      <Icon name="fork" size={14} />
      <Text size={3}>{formatNumber(forkCount)}</Text>
    </Stack>
    <Stack
      as={Button}
      variant="link"
      gap={1}
      autoWidth
      paddingX={0}
      onClick={onLikeToggle}
    >
      <Icon
        name="heart"
        size={14}
        css={css({ color: liked ? 'reds.300' : 'inherit' })}
      />
      <Text
        size={3}
        weight="normal"
        css={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}
      >
        {formatNumber(likeCount)}
      </Text>
    </Stack>
  </Stack>
);

type AuthorProps = Pick<CommunitySandboxItemComponentProps, 'author'>;
const Author: React.FC<AuthorProps> = React.memo(({ author }) => (
  // return empty div for alignment

  <Stack align="center" gap={2} css={{ flexShrink: 1, overflow: 'hidden' }}>
    {author.username ? (
      <Avatar css={css({ size: 6, borderRadius: 2 })} user={author} />
    ) : (
      <AnonymousAvatar />
    )}
    <Text size={3} maxWidth="100%">
      {author.username || 'Anonymous'}
    </Text>
  </Stack>
));

export const SandboxCard = ({
  title,
  TemplateIcon,
  screenshotUrl,
  likeCount,
  forkCount,
  author,
  liked,
  // interactions
  isScrolling,
  selected,
  onClick,
  onDoubleClick,
  onContextMenu,
  onLikeToggle,
  ...props
}: CommunitySandboxItemComponentProps) => {
  const [stoppedScrolling, setStoppedScrolling] = React.useState(false);
  React.useEffect(() => {
    // We only want to render the screenshot once the user has stopped scrolling
    if (!isScrolling && !stoppedScrolling) {
      setStoppedScrolling(true);
    }
  }, [isScrolling, stoppedScrolling]);

  return (
    <Stack
      direction="vertical"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      {...props}
      css={css({
        position: 'relative',
        width: '100%',
        height: 240,
        backgroundColor: 'grays.700',
        border: '1px solid',
        borderColor: selected ? 'blues.600' : 'grays.600',
        borderRadius: 'medium',
        overflow: 'hidden',
        transition: 'box-shadow ease-in-out',
        transitionDuration: theme => theme.speeds[4],
        ':hover, :focus, :focus-within': {
          boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
        },
      })}
    >
      <Thumbnail TemplateIcon={TemplateIcon} screenshotUrl={screenshotUrl} />

      <Stack
        direction="vertical"
        justify="space-between"
        css={css({ flexGrow: 1, paddingY: 4 })}
      >
        <SandboxTitle
          title={title}
          onContextMenu={onContextMenu}
          stoppedScrolling={stoppedScrolling}
        />
        <Stack
          justify="space-between"
          align="center"
          gap={2}
          marginLeft={4}
          marginRight={1}
        >
          <Author author={author} />
          <Stats
            likeCount={likeCount}
            forkCount={forkCount}
            liked={liked}
            onLikeToggle={onLikeToggle}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

const Thumbnail = ({ TemplateIcon, screenshotUrl }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '144px',
      backgroundColor: '#242424',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      borderBottom: '1px solid',
      borderColor: '#242424',
      backgroundImage: `url(${screenshotUrl})`,
      flexShrink: 0,
    }}
  >
    {!screenshotUrl && (
      <TemplateIcon
        style={{ filter: 'grayscale(1)', opacity: 0.1 }}
        width="60"
        height="60"
      />
    )}
    <div
      style={{
        position: 'absolute',
        top: 2,
        right: 2,
        width: 16,
        height: 16,
        border: '3px solid',
        borderRadius: 2,
        backgroundColor: '#343434',
        borderColor: '#343434',
      }}
    >
      <TemplateIcon width="16" height="16" />
    </div>
  </div>
);
