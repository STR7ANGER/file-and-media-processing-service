package uploads

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"sort"
)

type Part struct {
	Number   int
	Checksum string
	Bytes    int64
}
type Session struct {
	ExpectedParts    int
	MaximumBytes     int64
	ExpectedChecksum string
	Parts            map[int]Part
}

func New(parts int, max int64, checksum string) (*Session, error) {
	if parts < 1 || parts > 10000 || max < 1 {
		return nil, errors.New("invalid upload policy")
	}
	return &Session{ExpectedParts: parts, MaximumBytes: max, ExpectedChecksum: checksum, Parts: map[int]Part{}}, nil
}
func (s *Session) Record(part Part) error {
	if part.Number < 1 || part.Number > s.ExpectedParts || part.Bytes < 1 {
		return errors.New("invalid part")
	}
	if len(part.Checksum) != 64 {
		return errors.New("invalid checksum")
	}
	s.Parts[part.Number] = part
	return nil
}
func (s *Session) Complete(payload []byte) error {
	if len(s.Parts) != s.ExpectedParts {
		return errors.New("upload incomplete")
	}
	var total int64
	keys := make([]int, 0, len(s.Parts))
	for k := range s.Parts {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, k := range keys {
		total += s.Parts[k].Bytes
	}
	if total > s.MaximumBytes {
		return errors.New("size limit exceeded")
	}
	sum := sha256.Sum256(payload)
	if hex.EncodeToString(sum[:]) != s.ExpectedChecksum {
		return errors.New("checksum mismatch")
	}
	return nil
}
