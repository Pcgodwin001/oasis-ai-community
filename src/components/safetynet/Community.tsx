import { Users, MessageSquare, ThumbsUp, Share2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

const posts = [
  {
    id: 1,
    author: 'Anonymous User',
    avatar: 'A1',
    content: 'Found great deals on chicken at Kroger today - $1.99/lb! Stock up if you can.',
    category: 'Deals',
    likes: 24,
    replies: 8,
    time: '2 hours ago',
  },
  {
    id: 2,
    author: 'Anonymous User',
    avatar: 'A2',
    content: 'Looking for people interested in bulk buying rice. We can split a 50lb bag and save money. Jackson area.',
    category: 'Bulk Buying',
    likes: 15,
    replies: 12,
    time: '5 hours ago',
  },
  {
    id: 3,
    author: 'Anonymous User',
    avatar: 'A3',
    content: 'Easy budget recipe: Lentil soup costs about $3 and feeds 6 people. Recipe in comments!',
    category: 'Recipes',
    likes: 42,
    replies: 18,
    time: '1 day ago',
  },
];

export default function Community() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Community Support Forum</h1>
          <p className="text-gray-600">Share tips, recipes, and support (all posts are anonymous)</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-900">{post.author}</p>
                      <p className="text-gray-500">{post.time}</p>
                    </div>
                    <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                    <p className="text-gray-700 mb-4">{post.content}</p>
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {post.replies} Replies
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                💰 Deals & Savings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🛒 Bulk Buying
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🍲 Recipes
              </Button>
              <Button variant="outline" className="w-full justify-start">
                💪 Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-gray-600">Active Members</p>
                <p className="text-gray-900">2,847</p>
              </div>
              <div>
                <p className="text-gray-600">Posts This Week</p>
                <p className="text-gray-900">156</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
