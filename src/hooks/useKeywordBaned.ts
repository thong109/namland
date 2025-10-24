'use client';
import 'client-only';

import { useContext, useEffect, useState } from 'react';
import { GlobalSettingContext } from '../contexts/globalSettingContext';

function useKeywordBanned() {
  const context = useContext(GlobalSettingContext);
  const [keyword, setKeyword] = useState<string[] | []>([]);

  useEffect(() => {
    if (context.keyword) {
      setKeyword(context.keyword);
    } else {
      context.getKeywordBlacklist().then((keyword) => {
        if (keyword) {
          setKeyword(keyword);
        }
      });
    }
  }, [context]);
  const refreshKeywordBanned = () => {
    context.getKeywordBlacklist().then((keyword) => {
      if (keyword) {
        setKeyword(keyword);
      }
    });
  };
  return { keyword: keyword, refreshKeywordBanned };
}

export default useKeywordBanned;
